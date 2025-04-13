import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      onClick={handleBack}
      className="flex items-center gap-4 cursor-pointer"
    >
      <ArrowLeft className="w-5 h-5 text-gray-700" />
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
    </div>
  );
};
