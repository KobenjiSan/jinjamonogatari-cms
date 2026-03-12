export type CitationCMSDto = {
  citeId: number;
  title: string | null;
  author: string | null;
  url: string | null;
  year: number | null;
  createdAt: string;
  updatedAt: string;
};

type CitationFormValues = {
  title: string;
  author: string;
  url: string;
  year: string;

  // optional readonly CMS fields
  citeId?: number;
  createdAt?: string;
  updatedAt?: string;
};

type CitationFormProps = {
  values: CitationFormValues;
  onChange: (next: CitationFormValues) => void;
};

export default function CitationForm({ values, onChange }: CitationFormProps) {
  function handleFieldChange(field: keyof CitationFormValues, value: string) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return (
    <div className="column gap-sm">
      <div className="form-group">
        <label htmlFor="citation-title" className="label">
          Title
        </label>
        <input
          id="citation-title"
          className="input"
          type="text"
          value={values.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          placeholder="Enter citation title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="citation-author" className="label">
          Author
        </label>
        <input
          id="citation-author"
          className="input"
          type="text"
          value={values.author}
          onChange={(e) => handleFieldChange("author", e.target.value)}
          placeholder="Enter author name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="citation-url" className="label">
          URL
        </label>
        <input
          id="citation-url"
          className="input"
          type="text"
          value={values.url}
          onChange={(e) => handleFieldChange("url", e.target.value)}
          placeholder="Enter source URL"
        />
      </div>

      <div className="form-group">
        <label htmlFor="citation-year" className="label">
          Year
        </label>
        <input
          id="citation-year"
          className="input"
          type="number"
          value={values.year}
          onChange={(e) => handleFieldChange("year", e.target.value)}
          placeholder="Enter publication year"
        />
      </div>

      {values.citeId && (
        <div className="text-xs text-secondary">
          Citation ID: {values.citeId}
        </div>
      )}

      {values.createdAt && values.updatedAt && (
        <div className="text-xs text-secondary">
          Created: {values.createdAt}
          <br />
          Updated: {values.updatedAt}
        </div>
      )}
    </div>
  );
}