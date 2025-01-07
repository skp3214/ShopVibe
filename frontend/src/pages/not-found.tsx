import { MdError } from "react-icons/md"

const NotFound = () => {
  return (
    <div className="container not-found">
        <h1>404 - Not Found</h1>
        <MdError size={100} />
    </div>
  )
}

export default NotFound