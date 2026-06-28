//create a Tag function for the attribute buttons of the artwork
function Tag({label, value, type, isBanned, toggleBan}) {
    const disabled = 
                  !value || value === "Unknown" || value === "Unknown medium" || value === "Unclassified";
    const banned = !disabled && isBanned(type, value);

    return (
        <button className={`tag ${banned ? "tag--banned" : ""} ${disabled ? "tag--disabled" : ""}`}
                onClick={() => toggleBan(type, value)}
                disabled={disabled}
                title={disabled ? "No data to pin" : banned ? "Unpin from ban list" : "Pin to ban list"}
        >
            <span className="tag__label">{label}</span>
            <span className="tag__value">{value}</span>
        </button>
    );
}

//the art function should go here
function Art({artwork, isBanned, toggleBan}) {
    return (
        <div className="placard">
            <div className="placard__frame">
                {artwork.image ? (
                    <img src={artwork.image} alt={artwork.title} className="placard__image" />
                ) : (
                    <div className="placard__noimage">Sorry, there is no image available</div>
                )}
            </div>

            <div className="placard__info">
                <h2 className="placard__title">{artwork.title}</h2>
                <p className="placard__meta">
                    {artwork.people} · {artwork.date}
                </p>

                 <div className="placard__tags">
                    <Tag label="Culture" value={artwork.culture} type="culture" isBanned={isBanned} toggleBan={toggleBan}/>
                    <Tag label="Medium" value={artwork.medium} type="medium" isBanned={isBanned} toggleBan={toggleBan}/>
                    <Tag label="Classification" value={artwork.classification} type="classification" isBanned={isBanned} toggleBan={toggleBan}/>
                </div>
            </div>
        </div>
    );
}

export default Art;