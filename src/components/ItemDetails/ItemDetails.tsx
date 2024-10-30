import './Style.scss';

export default function ItemDetails({ item }: any) {
    return (
        <div className='menu-ui-itemdetails-container'>
            <div className="menu-ui-item" key={item.id}>
                <span className='menu-ui-item-name'>{item.name}</span>
                <span>{item.price}₹</span>
            </div>
            {
                item.description ?
                    <div className='menu-ui-item-description'>
                        <span>{item.description}</span>
                    </div> : ""
            }
        </div>
    )
}