import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface GoogleOAuthNoticeProps {
  isVisible: boolean;
}

const GoogleOAuthNotice = ({ isVisible }: GoogleOAuthNoticeProps) => {
  if (!isVisible) return null;

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
      <Info className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <strong>Lưu ý:</strong> Tính năng đăng nhập Google chưa được cấu hình. 
        Vui lòng xem file <code className="bg-yellow-100 px-1 rounded">GOOGLE_OAUTH_SETUP.md</code> để biết cách cấu hình.
      </AlertDescription>
    </Alert>
  );
};

export default GoogleOAuthNotice; 