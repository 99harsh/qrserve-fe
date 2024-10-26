import './Style.scss';

export default function ItemDetails({ item }: any) {
    return (
        <div className='menu-ui-itemdetails-container'>
            <div className="menu-ui-item" key={item.id}>
                <span className='menu-ui-item-name'>{item.name}</span>
                <span>{item.price}₹</span>
            </div>
            {
                item.description || item.name === 'White Sauce Pasta' ?
                    <div className='menu-ui-item-description'>
                        <span>I am description hello worldI am description hello worldI am description hello worldI am description hello world</span>
                    </div> : ""
            }
        </div>
    )
}