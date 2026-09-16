import { useState } from "react";
import styles from "./Filters.module.css";

export type ShrineSearchFilters = {
  searchValue: string | null;
  prefecture: string | null;
  sorting: string | null;
}

type FiltersProps = {
  onSearch: (query: ShrineSearchFilters) => void;
};

export default function Filters({onSearch}: FiltersProps) {
  const [searchValue, setSearchValue] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [sorting, setSorting] = useState("");

  function handleSearch(){
    onSearch({
      searchValue: searchValue.trim(),
      prefecture: prefecture.trim(),
      sorting: sorting.trim(),
    });
  }

  return (
    <div className={styles.filters}>
      <input 
        type="text" 
        placeholder="Search shrines..." 
        className="input" 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <select
        id="location-filter"
        className="select"
        value={prefecture}
        onChange={(e) => setPrefecture(e.target.value)}
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
        id="sorting-filter"
        className="select"
        value={sorting}
        onChange={(e) => setSorting(e.target.value)}
      >
        <option value="">Filters</option>
        <option value="titleAsc">Title (A → Z)</option>
        <option value="titleDesc">Title (Z → A)</option>
        <option value="updatedDesc">Last Updated (Newest First)</option>
        <option value="updatedAsc">Last Updated (Oldest First)</option>
      </select>

      <button className="btn btn-outline" onClick={handleSearch}>Apply</button>
    </div>
  );
}
