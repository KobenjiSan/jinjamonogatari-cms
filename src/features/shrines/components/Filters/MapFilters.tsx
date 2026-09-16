import { useState } from "react";
import styles from "./Filters.module.css";

export type ShrineMapSearchFilters = {
  searchValue: string | null;
  region: string | null;
  prefecture: string | null;
  status: string | null;
}

type MapFiltersProps = {
  onSearch: (query: ShrineMapSearchFilters) => void;
};

export default function MapFilters({onSearch}: MapFiltersProps) {
  const [searchValue, setSearchValue] = useState("");
  const [region, setRegion] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [status, setStatus] = useState("");

  function handleSearch(){
    onSearch({
      searchValue: searchValue.trim(),
      region: region.trim(),
      prefecture: prefecture.trim(),
      status: status.trim(),
    });
  }

  return (
    <div className={styles.mapFilters}>
      <input 
        type="text" 
        placeholder="Search shrines..." 
        className="input" 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
        disabled={true}
      />

      <select
        id="region-filter"
        className="select"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        disabled={true}
      >
        <option value="">Region</option>
        <option value="hokkaido">Hokkaido (北海道)</option>
        <option value="tohoku">Tohoku (東北地方)</option>
        <option value="kanto">Kanto (関東地方)</option>
        <option value="chubu">Chubu (中部地方)</option>
        <option value="kansai">Kansai (関西地方)</option>
        <option value="chugoku">Chugoku (中国地方)</option>
        <option value="shikoku">Shikoku (四国地方)</option>
        <option value="kyushu-okinawa">Kyushu & Okinawa (九州・沖縄地方)</option>
      </select>

      <select
        id="prefecture-filter"
        className="select"
        value={prefecture}
        onChange={(e) => setPrefecture(e.target.value)}
        disabled={true}
      >
        <option value="">Prefecture</option>
        <option value="hokkaido">Hokkaido (北海道)</option>
        <option value="aomori">Aomori (青森県)</option>
        <option value="iwate">Iwate (岩手県)</option>
        <option value="miyagi">Miyagi (宮城県)</option>
        <option value="akita">Akita (秋田県)</option>
        <option value="yamagata">Yamagata (山形県)</option>
        <option value="fukushima">Fukushima (福島県)</option>
        <option value="ibaraki">Ibaraki (茨城県)</option>
        <option value="tochigi">Tochigi (栃木県)</option>
        <option value="gunma">Gunma (群馬県)</option>
        <option value="saitama">Saitama (埼玉県)</option>
        <option value="chiba">Chiba (千葉県)</option>
        <option value="tokyo">Tokyo (東京都)</option>
        <option value="kanagawa">Kanagawa (神奈川県)</option>
        <option value="niigata">Niigata (新潟県)</option>
        <option value="toyama">Toyama (富山県)</option>
        <option value="ishikawa">Ishikawa (石川県)</option>
        <option value="fukui">Fukui (福井県)</option>
        <option value="yamanashi">Yamanashi (山梨県)</option>
        <option value="nagano">Nagano (長野県)</option>
        <option value="gifu">Gifu (岐阜県)</option>
        <option value="shizuoka">Shizuoka (静岡県)</option>
        <option value="aichi">Aichi (愛知県)</option>
        <option value="mie">Mie (三重県)</option>
        <option value="shiga">Shiga (滋賀県)</option>
        <option value="kyoto">Kyoto (京都府)</option>
        <option value="osaka">Osaka (大阪府)</option>
        <option value="hyogo">Hyogo (兵庫県)</option>
        <option value="nara">Nara (奈良県)</option>
        <option value="wakayama">Wakayama (和歌山県)</option>
        <option value="tottori">Tottori (鳥取県)</option>
        <option value="shimane">Shimane (島根県)</option>
        <option value="okayama">Okayama (岡山県)</option>
        <option value="hiroshima">Hiroshima (広島県)</option>
        <option value="yamaguchi">Yamaguchi (山口県)</option>
        <option value="tokushima">Tokushima (徳島県)</option>
        <option value="kagawa">Kagawa (香川県)</option>
        <option value="ehime">Ehime (愛媛県)</option>
        <option value="kochi">Kochi (高知県)</option>
        <option value="fukuoka">Fukuoka (福岡県)</option>
        <option value="saga">Saga (佐賀県)</option>
        <option value="nagasaki">Nagasaki (長崎県)</option>
        <option value="kumamoto">Kumamoto (熊本県)</option>
        <option value="oita">Oita (大分県)</option>
        <option value="miyazaki">Miyazaki (宮崎県)</option>
        <option value="kagoshima">Kagoshima (鹿児島県)</option>
        <option value="okinawa">Okinawa (沖縄県)</option>
      </select>

      <select
        id="status-filter"
        className="select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Status</option>
        <option value="import">Imported</option>
        <option value="draft">Drafts</option>
        <option value="review">Under Review</option>
        <option value="published">Published</option>
      </select>

      <button className="btn btn-outline" onClick={handleSearch}>Apply</button>
    </div>
  );
}
