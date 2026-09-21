import { Pencil, Trash2 } from "lucide-react";

type RowActionsProps = {
  // Row name, used in the buttons' accessible labels ("ویرایش <name>").
  name: string;
  onEdit?: () => void;
  onDelete: () => void;
};

export function RowActions({ name, onEdit, onDelete }: RowActionsProps) {
  return (
    <div className="row-actions">
      {onEdit ? (
        <button type="button" className="row-action row-action--edit" onClick={onEdit} aria-label={`ویرایش ${name}`} title="ویرایش">
          <Pencil aria-hidden />
          <span>ویرایش</span>
        </button>
      ) : null}
      <button type="button" className="row-action row-action--delete" onClick={onDelete} aria-label={`حذف ${name}`} title="حذف">
        <Trash2 aria-hidden />
        <span>حذف</span>
      </button>
    </div>
  );
}
