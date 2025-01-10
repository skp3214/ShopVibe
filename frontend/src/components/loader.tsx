
const Loader = () => {
  return (
    <section className="loader">
      <div></div>
    </section>
  )
}

export default Loader

export const SkeletonLoader=({ width="unset" }:{width:string})=>{
  return (
    <div className="skeleton-loader" style={{width:width}}>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
    </div>
  )
}