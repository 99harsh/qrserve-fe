import "./Style.scss";
export default function Loading() {
    return (
        <div className="loader-container">
            <div>
                <span className="loader"></span>
            </div>
            <div>
                <span className="loading-text">Loading...</span>
            </div>
        </div>
    )
}