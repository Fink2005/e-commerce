interface SectionBadgeProps {
  name: string;
}

const SectionBadge = ({ name }: SectionBadgeProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-6 bg-red-500 rounded-full">&nbsp;</div>
      <p className="text-red-500 text-sm font-semibold">{name}</p>
    </div>
  );
};

export default SectionBadge;
