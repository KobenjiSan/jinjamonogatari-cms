import type { EntityAuditCMSDto } from "../../ShrineEditor/components/EditorArea/components/tabs/kami/kamiApi";

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
  isReadOnly: boolean;
  entityAudit?: EntityAuditCMSDto | null | undefined;
  needsAuditDisplay?: boolean;
};

export default function CitationForm({
  values,
  onChange,
  isReadOnly,
  entityAudit,
  needsAuditDisplay = true,
}: CitationFormProps) {
  function handleFieldChange(field: keyof CitationFormValues, value: string) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  const titleError = needsAuditDisplay
    ? !values.title.trim()
      ? (entityAudit?.issues?.find(
          (issue) =>
            issue.field === "Title" &&
            issue.severity === "Error" &&
            issue.relatedItemType !== "Image",
        )?.message ?? "Citation is missing title.")
      : null
    : null;

  const authorError = needsAuditDisplay
    ? !values.author.trim()
      ? (entityAudit?.issues?.find(
          (issue) =>
            issue.field === "Author" &&
            issue.severity === "Error" &&
            issue.relatedItemType !== "Image",
        )?.message ?? "Citation is missing author.")
      : null
    : null;

  const yearError = needsAuditDisplay
    ? !values.year.trim()
      ? (entityAudit?.issues?.find(
          (issue) =>
            issue.field === "Year" &&
            issue.severity === "Error" &&
            issue.relatedItemType !== "Image",
        )?.message ?? "Citation is missing year.")
      : null
    : null;

  const enteredUrl = values.url.trim();

  let validUrl = false;
  if (enteredUrl) {
    try {
      const parsed = new URL(enteredUrl);
      validUrl = parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      // Text isn't a URL
    }
  }

  const urlWarning = needsAuditDisplay && !enteredUrl
    ? "Citation URL is suggested."
    : null;

  const urlError = needsAuditDisplay && enteredUrl && !validUrl
    ? "Citation URL format is invalid."
    : null;

  return (
    <div className="column gap-sm">
      <div className="form-group">
        <label htmlFor="citation-title" className="label">
          Title
        </label>
        <input
          id="citation-title"
          className={`input${titleError ? " input-error" : ""}`}
          type="text"
          value={values.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          placeholder={isReadOnly ? "null" : "Enter citation title"}
          disabled={isReadOnly}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? "citation-title-error" : undefined}
        />
        {titleError && (
          <p id="citation-title-error" className="field-error">
            {titleError}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="citation-author" className="label">
          Author
        </label>
        <input
          id="citation-author"
          className={`input${authorError ? " input-error" : ""}`}
          type="text"
          value={values.author}
          onChange={(e) => handleFieldChange("author", e.target.value)}
          placeholder={isReadOnly ? "null" : "Enter author name"}
          disabled={isReadOnly}
          aria-invalid={Boolean(authorError)}
          aria-describedby={authorError ? "citation-author-error" : undefined}
        />
        {authorError && (
          <p id="citation-author-error" className="field-error">
            {authorError}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="citation-url" className="label">
          URL
        </label>
        <input
          id="citation-url"
          className={`input${urlError ? " input-error" : urlWarning ? " input-warning" : ""}`}
          type="text"
          value={values.url}
          onChange={(e) => handleFieldChange("url", e.target.value)}
          placeholder={isReadOnly ? "null" : "Enter source URL"}
          disabled={isReadOnly}
          aria-invalid={Boolean(urlError)}
          aria-describedby={
            urlError
              ? "citation-url-error"
              : urlWarning
                ? "citation-url-warning"
                : undefined
          }
        />
        {urlError && (
          <p id="citation-url-error" className="field-error">
            {urlError}
          </p>
        )}
        {urlWarning && (
          <p id="citation-url-warning" className="field-warning">
            {urlWarning}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="citation-year" className="label">
          Year
        </label>
        <input
          id="citation-year"
          className={`input${yearError ? " input-error" : ""}`}
          type="number"
          value={values.year}
          onChange={(e) => handleFieldChange("year", e.target.value)}
          placeholder={isReadOnly ? "null" : "Enter publication year"}
          disabled={isReadOnly}
          aria-invalid={Boolean(yearError)}
          aria-describedby={yearError ? "citation-year-error" : undefined}
        />
        {yearError && (
          <p id="citation-year-error" className="field-error">
            {yearError}
          </p>
        )}
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
