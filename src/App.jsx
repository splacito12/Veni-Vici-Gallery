import { useCallback, useState } from 'react'
import heroImg from './assets/hero.png'
import BanList from './components/BanList'
import Art from './components/Art'
import './App.css'

const API_KEY = import.meta.env.VITE_APP_HARVARD_KEY;
const BASE_URL = "https://api.harvardartmuseums.org/object";

function App() {
  const [count, setCount] = useState(0)
  const [artwork, setArtwork] = useState(null);
  const [bannedCulture, setBannedCulture] = useState([]);
  const [bannedMedium, setBannedMedium] = useState([]);
  const [bannedClassification, setBannedClassification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const buildBanParam = (list) => list.length ? list.map((v) => `-"${v}"`).join(" AND ") : null;

  const cultureBan = buildBanParam(bannedCulture, "culture");
  const mediumBan = buildBanParam(bannedMedium, "medium");
  const classificationBan = buildBanParam(bannedClassification, "classification");


  const fetchArtwork = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        apikey: API_KEY,
        size: "1",
        hasimage: "1",
        sort: "random",
      });

      // const cultureBan = buildBanParam(bannedCulture, "culture");
      // const mediumBan = buildBanParam(bannedMedium, "medium");
      // const classificationBan = buildBanParam(bannedClassification, "classification");
      const filters = [cultureBan, mediumBan, classificationBan].filter(Boolean);
      
      if(filters.length){
        params.set("q", filters.join(" AND "));
      }

      const res = await fetch(`${BASE_URL}?${params.toString()}`);
      if(!res.ok){
        throw new Error("We could not react the museum :(");
      }
      const data = await res.json();

      const result = data.records?.[0];
      if(!result){
        setError("We could no longer find a match. Please try unpinning something :D.");
        setLoading(false);
        return;
      }

      setArtwork({
        id: result.id,
        title: result.title || "Untitled",
        image: result.primaryimageurl,
        culture: result.culture || "Unknown",
        medium: result.medium || "Unknown medium",
        classification: result.classification || "Unclassified",
        date: result.dated || "Date Unknown",
        people: result.people?.map((p) =>p.name).join(", ") || "Unknown artist",
      });
      setHasStarted(true);
    } catch (err) {
      setError(err.message || "Something went wrong while fetching the next piece.");
    }finally {
      setLoading(false);
    }
  }, [bannedCulture, bannedMedium, bannedClassification]);

  const toggleBan = (type, value) => {
    if(!value || value === "Unknown" || value === "Unknown medium" || value === "Unclassified"){
      return;
    }

    const setterMap = {
      culture: [bannedCulture, setBannedCulture],
      medium: [bannedMedium, setBannedMedium],
      classification: [bannedClassification, setBannedClassification],
    };

    const [list, setList] = setterMap[type];
    if(list.includes(value)){
      setList(list.filter((v) => v !== value));
    }else{
      setList([...list, value]);
    }
  };

  const isBanned = (type, value) => {
    const map = {
      culture: bannedCulture,
      medium: bannedMedium,
      classification: bannedClassification,
    };

    return map[type].includes(value);
  };

  return (
    <div className='gallery'>
      <header className='gallery__header'>
        <span className='gallery__subtext'> Harvard Art Museums · Random Acquisition</span>
        <h1 className='gallery__title'>Veni Vici Gallery</h1>
        <p className='gallery__subtitle'>
          Explore what the museum has to offer!
        </p>
        <p className='gallery__subtitle'>
          Tap a label to ban it.
        </p>
      </header>

      <main className='gallery__main'>
        {!hasStarted && !loading && (
          <div className='placard placard--empty'>
            <p> Your next piece in the collection is waiting!</p>
          </div>
        )}

        {loading && (
          <div className='placard placard--empty'>
            <p className='placard__loading'>Retrieving from our archive...</p>
          </div>
        )}

        {error && !loading && (
          <div className='placard placard--empty'>
            <p>{error}</p>
          </div>
        )}

        {artwork && !loading && !error && (
          <Art artwork={artwork} isBanned={isBanned} toggleBan={toggleBan} />
        )}

        <button className='discover-btn' onClick={fetchArtwork} disabled={loading}>
          {hasStarted ? "Next Piece" : "Discover"}
        </button>
      </main>

      <BanList
        bannedCulture={bannedCulture}
        bannedMedium={bannedMedium}
        bannedClassification={bannedClassification}
        toggleBan={toggleBan}
      />
    </div>
  );
}

export default App;