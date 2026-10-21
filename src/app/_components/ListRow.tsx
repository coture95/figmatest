type ListRowProps = {
  label: string;
  value: string;
};

export default function ListRow({ label, value }: ListRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border-subtle px-1 py-3 text-body-small">
      <p className="flex-1 font-medium text-text-secondary">{label}</p>
      <p className="text-right font-semibold text-text-primary">{value}</p>
    </div>
  );
}
