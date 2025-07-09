import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAdminSystem } from "../useAdmin";
import { Settings } from "lucide-react";

const AdminSystemPage = () => {
    const {
        storeInfo,
        maintenanceMode,
        handleInfoChange,
        handleMaintenanceChange,
        saveStoreInfo,
        saveMaintenanceMode,
    } = useAdminSystem();

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center gap-4 mb-2">
                <Settings className="h-7 w-7 text-dessert-accent" />
                <h1 className="text-3xl font-display font-bold text-dessert-primary">Cài đặt hệ thống</h1>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
                <Card className="shadow-card rounded-2xl border-0">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-dessert-dark">Thông tin cửa hàng</CardTitle>
                        <CardDescription className="text-muted-foreground">Cập nhật thông tin hiển thị trên website.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveStoreInfo(); }}>
                            <div className="space-y-2">
                                <Label htmlFor="store-name" className="font-semibold text-dessert-primary">Tên cửa hàng</Label>
                                <Input 
                                    id="store-name" 
                                    value={storeInfo.name}
                                    onChange={(e) => handleInfoChange('name', e.target.value)}
                                    className="rounded-xl border-dessert-secondary focus:border-dessert-accent focus:ring-2 focus:ring-dessert-accent/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="store-description" className="font-semibold text-dessert-primary">Mô tả ngắn</Label>
                                <Textarea 
                                    id="store-description" 
                                    value={storeInfo.description}
                                    onChange={(e) => handleInfoChange('description', e.target.value)}
                                    className="rounded-xl border-dessert-secondary focus:border-dessert-accent focus:ring-2 focus:ring-dessert-accent/30"
                                />
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex justify-end">
                        <Button onClick={saveStoreInfo} className="bg-dessert-accent hover:bg-dessert-primary text-white font-semibold rounded-xl shadow-glow">Lưu</Button>
                    </CardFooter>
                </Card>

                <Card className="shadow-card rounded-2xl border-0">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-dessert-dark">Bảo trì Website</CardTitle>
                        <CardDescription className="text-muted-foreground">Tạm thời đóng cửa website để bảo trì.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4 py-2">
                            <Switch 
                                id="maintenance-mode" 
                                checked={maintenanceMode}
                                onCheckedChange={handleMaintenanceChange}
                                className="scale-125 data-[state=checked]:bg-dessert-accent data-[state=checked]:border-dessert-accent"
                            />
                            <Label htmlFor="maintenance-mode" className="font-semibold text-dessert-primary">Bật chế độ bảo trì</Label>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex justify-end">
                        <Button onClick={saveMaintenanceMode} className="bg-dessert-accent hover:bg-dessert-primary text-white font-semibold rounded-xl shadow-glow">Lưu</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default AdminSystemPage; 