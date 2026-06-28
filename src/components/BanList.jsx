function BanList({bannedCulture, bannedMedium, bannedClassification, toggleBan}) {
    const temp = bannedCulture.length || bannedMedium.length || bannedClassification.length;

    return (
        <div className="banList">
            <h2 className="banList__title">Off Limits</h2>
            {!temp && <p className="banList__empty">Nothing has been pinned yet. Tap any label to ban it.</p>}

            {!!bannedCulture.length && (
                <div className="banList__group">
                    <span className="banList_groupLabel">Culture</span>
                    <div className="banList__chips">
                        {bannedCulture.map((v) => (
                            <button key={v} className="chip" onClick={() => toggleBan("culture", v)}>{v}</button>
                        ))}
                    </div>
                </div>
            )}

            {!!bannedMedium.length && (
                <div className="banList__group">
                    <span className="banList_groupLabel">Medium</span>
                    <div className="banList__chips">
                        {bannedMedium.map((v) => (
                            <button key={v} className="chip" onClick={() => toggleBan("medium", v)}>{v}</button>
                        ))}
                    </div>
                </div>
            )}

            {!!bannedClassification.length && (
                <div className="banList__group">
                    <span className="banList_groupLabel">Classification</span>
                    <div className="banList__chips">
                        {bannedClassification.map((v) => (
                            <button key={v} className="chip" onClick={() => toggleBan("classification", v)}>{v}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BanList;