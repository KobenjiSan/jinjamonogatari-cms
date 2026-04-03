import { useEffect, useState } from "react";
import { getAllTagsList, type TagDto } from "./tagApi";

export type TagFormValues = {
  tagId: number | null;
  titleEn: string;
  titleJp: string;
};

type TagFormProps = {
  values: TagFormValues;
  onChange: (next: TagFormValues) => void;
  editable?: boolean;
};

export default function TagForm({
  values,
  onChange,
  editable = true,
}: TagFormProps) {
  const [globalTags, setGlobalTags] = useState<TagDto[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | "">(
    values.tagId ?? ""
  );

  useEffect(() => {
    async function getTags() {
      try {
        const result = await getAllTagsList();
        setGlobalTags(result);
      } catch (err) {
        console.error("Failed to retreive tags", err);
      }
    }

    getTags();
  }, []);

  function handleFieldChange(field: keyof TagFormValues, value: string | number | null) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return (
    <div className="column gap-lg">
      <div className="form-group">
        <select
          id="location-filter"
          className="select"
          value={selectedTagId}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : "";
            setSelectedTagId(id);

            const selected = globalTags.find((t) => t.tagId === id);

            if (selected) {
              onChange({
                tagId: selected.tagId,
                titleEn: selected.titleEn,
                titleJp: selected.titleJp || "",
              });
            } else {
              onChange({
                tagId: null,
                titleEn: "",
                titleJp: "",
              });
            }
          }}
        >
          <option value="">Find existing tag</option>
          {globalTags.map((tag) => (
            <option key={tag.tagId} value={tag.tagId}>
              {tag.titleEn} ({tag.titleJp})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tag-title-en" className="label">
          Title (English)
        </label>
        <input
          id="tag-title-en"
          className="input"
          type="text"
          value={values.titleEn}
          onChange={(e) => handleFieldChange("titleEn", e.target.value)}
          placeholder="Enter English title"
          disabled={!editable}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tag-title-jp" className="label">
          Title (Japanese)
        </label>
        <input
          id="tag-title-jp"
          className="input"
          type="text"
          value={values.titleJp}
          onChange={(e) => handleFieldChange("titleJp", e.target.value)}
          placeholder="Enter Japanese title"
          disabled={!editable}
        />
      </div>
    </div>
  );
}