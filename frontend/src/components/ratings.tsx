import { useRating } from "6pp"
import { FaRegStar, FaStar } from "react-icons/fa"

const RatingsComponent = ({ value = 0 }: { value: number }) => {
    const { Ratings } = useRating({ IconFilled: <FaStar />, IconOutline: <FaRegStar />, value: value,
        styles:{
            fontSize: "1.5rem",
            color: "#f8e825",
            justifyContent:"flex-start"
        }
     })
    return (
        <Ratings />
    )
}

export default RatingsComponent;