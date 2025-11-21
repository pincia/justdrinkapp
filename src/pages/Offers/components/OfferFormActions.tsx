import Button from "../../../components/ui/button/Button";

type Props = {
  submitting?: boolean;
  isReadOnly: boolean;
};

export default function OfferFormActions({ submitting, isReadOnly }: Props) {
  if (isReadOnly) return null;

  return (
    <div className="flex justify-end mt-6">
      <Button variant="primary" disabled={!!submitting}>
        {submitting ? "Salvataggio..." : "Salva Offerta"}
      </Button>
    </div>
  );
}
