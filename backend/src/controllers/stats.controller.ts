import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { CalculatePercentage, getChartData, getInventories } from "../utils/features.js";
import { redis } from "../app.js";

export const getDashboardStats = TryCatch(async (
    req,
    res,
    next
) => {
    let stats;
    const cacheKey = "dashboardStat";
    const cachedStats = await redis.get(cacheKey);

    if (cachedStats) {
        stats = JSON.parse(cachedStats);
    } else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        const currentMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        }
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0),
        }

        const currentMonthProductsPromise = Product.find({
            createdAt: {
                $gte: currentMonth.start,
                $lte: currentMonth.end,
            }
        })

        const lastMonthProductsPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            }
        })

        const currentMonthUsersPromise = User.find({
            createdAt: {
                $gte: currentMonth.start,
                $lte: currentMonth.end,
            }
        })

        const lastMonthUsersPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            }
        })

        const currentMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: currentMonth.start,
                $lte: currentMonth.end,
            }
        })

        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            }
        })

        const lastSixMonthsOrdersPromise = Order.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            }
        })

        const latestTransactionPromise = Order.find().sort({ createdAt: -1 }).select(
            "discount total status orderItems"
        ).limit(4);

        const [
            currentMonthProducts,
            lastMonthProducts,
            currentMonthUsers,
            lastMonthUsers,
            currentMonthOrders,
            lastMonthOrders,
            productsCount,
            usersCount,
            allOrders,
            lastSixMonthsOrders,
            categories,
            femaleUsersCount,
            latestTransaction
        ] = await Promise.all([
            currentMonthProductsPromise,
            lastMonthProductsPromise,
            currentMonthUsersPromise,
            lastMonthUsersPromise,
            currentMonthOrdersPromise,
            lastMonthOrdersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthsOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransactionPromise
        ]);

        const currentMonthRevenue = currentMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);

        const userChangePercentage = CalculatePercentage(currentMonthUsers.length, lastMonthUsers.length);
        const productChangePercentage = CalculatePercentage(currentMonthProducts.length, lastMonthProducts.length);
        const orderChangePercentage = CalculatePercentage(currentMonthOrders.length, lastMonthOrders.length);
        const revenueChangePercentage = CalculatePercentage(currentMonthRevenue, lastMonthRevenue);
        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);

        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthlyRevenue = new Array(6).fill(0);
        lastSixMonthsOrders.forEach((order) => {
            const creationDate = new Date(order.createdAt); // Ensure createdAt is a Date object
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
            }
        });

        const categoryCount: Record<string, number>[] = await getInventories({ categories, productsCount });

        const count = {
            revenue,
            products: productsCount,
            users: usersCount,
            orders: allOrders.length,
        }
        const changePercent = {
            revenue: revenueChangePercentage,
            products: productChangePercentage,
            users: userChangePercentage,
            orders: orderChangePercentage,
        }

        const chart = {
            order: orderMonthCounts,
            revenue: orderMonthlyRevenue
        }

        const ratio = {
            male: usersCount - femaleUsersCount,
            female: femaleUsersCount
        }
        const modifiedLatestTransation = latestTransaction.map((transaction) => ({
            _id: transaction._id,
            discount: transaction.discount,
            amount: transaction.total,
            quantity: transaction.orderItems.length,
            status: transaction.status
        }));
        stats = {
            changePercent,
            count,
            chart,
            categoryCount,
            ratio,
            latestTransaction: modifiedLatestTransation
        };

        await redis.set(cacheKey, JSON.stringify(stats));
    }
    await redis.del(cacheKey);
    res.status(200).json({
        success: true,
        stats,
    });
});

export const getPieCharts = TryCatch(async (
    req,
    res,
    next
) => {
    let charts;
    const cacheKey = "admin-pie-charts";
    const cachedCharts = await redis.get(cacheKey);

    if (cachedCharts) {
        charts = JSON.parse(cachedCharts);
    } else {
        const allOrderPromise = await Order.find({}).select(["total", "discount", "subtotal", "tax", "shippingCharges"]);

        const [
            processingOrders,
            shippedOrders,
            deliveredOrders,
            categories,
            productsCount,
            outOfStockProducts,
            allOrders,
            allUsers,
            customerUsers,
            adminUsers
        ] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({ stock: 0 }),
            allOrderPromise,
            User.find({}).select(["dob"]),
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "admin" })
        ]);
        const orderFullfillment = {
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders
        }

        const productCategories: Record<string, number>[] = await getInventories({ categories, productsCount });

        const stockAvailability = {
            inStock: productsCount - outOfStockProducts,
            outOfStock: outOfStockProducts
        }

        const grossIncome = allOrders.reduce((total, order) => total + (order.total || 0), 0);
        const discount = allOrders.reduce((total, order) => total + (order.discount || 0), 0);
        const productionCost = allOrders.reduce((total, order) => total + (order.shippingCharges || 0), 0);
        const markettingCost = Math.round(grossIncome * 0.3);
        const burnt = allOrders.reduce((total, order) => total + (order.tax || 0), 0);
        const netMargin = grossIncome - discount - productionCost - markettingCost - burnt;
        const revenueDistribution = {
            netMargin: netMargin,
            productionCost: productionCost,
            markettingCost: markettingCost,
            burnt: burnt,
            discount: discount
        };

        const usersAgeGroup = {
            teen: allUsers.filter((user) => user.age < 20).length,
            adult: allUsers.filter((user) => user.age >= 20 && user.age < 40).length,
            old: allUsers.filter((user) => user.age >= 40 && user.age < 60).length,
        }

        const adminCustomer = {
            customer: customerUsers,
            admin: adminUsers
        }

        charts = {
            orderFullfillment,
            productCategories,
            stockAvailability,
            revenueDistribution,
            adminCustomer,
            usersAgeGroup
        }
        await redis.set(cacheKey, JSON.stringify(charts));
        await redis.del(cacheKey);
    }
    return res.status(200).json({
        success: true,
        charts
    });
});

export const getBarCharts = TryCatch(async (
    req,
    res,
    next
) => {
    let charts;
    const cacheKey = "barCharts";
    const cachedCharts = await redis.get(cacheKey);

    if (cachedCharts) {
        charts = JSON.parse(cachedCharts);
    } else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(today.getMonth() - 12);

        const lastSixMonthsProductsPromise = Product.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            }
        }).select("createdAt");

        const lastSixMonthUsersPromise = User.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            }
        }).select("createdAt");

        const lastSixMonthsOrdersPromise = Order.find({
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            }
        }).select("createdAt");

        const [
            lastSixMonthsProducts,
            lastSixMonthUsers,
            lastSixMonthsOrders
        ] = await Promise.all([
            lastSixMonthsProductsPromise,
            lastSixMonthUsersPromise,
            lastSixMonthsOrdersPromise
        ])

        const productCount = getChartData({ length: 6, docArr: lastSixMonthsProducts });
        const userCount = getChartData({ length: 6, docArr: lastSixMonthUsers });
        const orderCount = getChartData({ length: 12, docArr: lastSixMonthsOrders });

        charts = {
            products: productCount,
            users: userCount,
            orders: orderCount
        }
        await redis.set(cacheKey, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts
    });
});

export const getLineCharts = TryCatch(async (
    req,
    res,
    next
) => {
    let charts;
    const cacheKey = "lineCharts";
    const cachedCharts = await redis.get(cacheKey);

    if (cachedCharts) {
        charts = JSON.parse(cachedCharts);
    } else {
        const today = new Date();

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(today.getMonth() - 12);

        const baseQuery = {
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            }
        }

        const [
            lastTwelveMonthsProduct,
            lastTwelveMonthsUsers,
            lastTwelveMonthsOrders
        ] = await Promise.all([
            Product.find(baseQuery).select("createdAt"),
            User.find(baseQuery).select("createdAt"),
            Order.find(baseQuery).select(["createdAt", "discount", "total"])
        ])

        const productCount = getChartData({ length: 12, docArr: lastTwelveMonthsProduct });
        const userCount = getChartData({ length: 12, docArr: lastTwelveMonthsUsers });
        const discount = getChartData({ length: 12, docArr: lastTwelveMonthsOrders, property: "discount" });
        const revenue = getChartData({ length: 12, docArr: lastTwelveMonthsOrders, property: "total" });
        charts = {
            users: userCount,
            products: productCount,
            discount: discount,
            revenue: revenue
        }
        await redis.set(cacheKey, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts
    });
});