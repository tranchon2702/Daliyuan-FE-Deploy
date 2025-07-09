import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useAdminOrders, Order } from "../useAdmin";
import { Input } from "@/components/ui/input";

const AdminOrdersPage = () => {
  const { orders, handleSearch } = useAdminOrders();

  // Hàm xuất Excel đúng template phiếu xuất kho (dùng exceljs)
  const exportExcel = async (order: Order) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PhieuXuatKho");

    // --- Cài đặt chiều rộng cột (Fixed) ---
    worksheet.columns = [
      { key: 'A', width: 6 },   // STT
      { key: 'B', width: 30 },  // Tên sản phẩm (phần 1)
      { key: 'C', width: 18 },  // Tên sản phẩm (phần 2)
      { key: 'D', width: 18 },  // Mã hàng
      { key: 'E', width: 10 },   // SL
      { key: 'F', width: 15 },  // Giá
      { key: 'G', width: 18 },  // Thành tiền
      { key: 'H', width: 15 },  // Ghi chú
    ];

    // --- Style chung ---
    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
    };
    const setBorder = (cell: ExcelJS.Cell) => { cell.border = thinBorder; };

    // --- Header chính ---
    worksheet.mergeCells('A1:H2');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = {
      richText: [
        {
          text: 'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ XUẤT NHẬP KHẨU TÂN THỜI ĐẠI\n',
          font: { size: 14, bold: true }
        },
        {
          text: 'PHIẾU XUẤT KHO',
          font: { size: 14, bold: true }
        }
      ]
    };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    worksheet.getRow(1).height = 40;


    // --- Khối thông tin khách hàng (Layout mới) ---
    worksheet.mergeCells('A3:H3');
    const customerCell = worksheet.getCell('A3');
    customerCell.value = `Khách hàng: ${order.customer}`;
    customerCell.border = thinBorder;
    
    worksheet.mergeCells('A4:H4');
    const addressCell = worksheet.getCell('A4');
    addressCell.value = `Địa chỉ: ${order.address}`;
    addressCell.border = thinBorder;

    const infoRow = worksheet.getRow(5);
    worksheet.mergeCells('A5:C5');
    infoRow.getCell('A').value = `Ngày: ${order.date}`;
    worksheet.mergeCells('D5:F5');
    infoRow.getCell('D').value = `Mã khách hàng: ${order.so}`;
    worksheet.mergeCells('G5:H5');
    infoRow.getCell('G').value = `Số điện thoại: ${order.phone}`;
    infoRow.eachCell({ includeEmpty: true }, setBorder);

    // --- Bảng sản phẩm ---
    const productHeaderRow = worksheet.getRow(6);
    // Gán giá trị thủ công để merge
    productHeaderRow.getCell('A').value = "STT";
    worksheet.mergeCells('B6:C6');
    productHeaderRow.getCell('B').value = "Tên sản phẩm";
    productHeaderRow.getCell('D').value = "Mã sản phẩm";
    productHeaderRow.getCell('E').value = "Số lượng";
    productHeaderRow.getCell('F').value = "Giá";
    productHeaderRow.getCell('G').value = "Thành tiền";
    productHeaderRow.getCell('H').value = "Ghi chú";

    productHeaderRow.eachCell({ includeEmpty: true}, cell => {
      if (cell.value) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = thinBorder;
      }
    });

    order.products.forEach((p, idx) => {
      const row = worksheet.addRow([
        idx + 1, p.name, null, p.code, p.qty, p.price, p.total, p.note
      ]);
      worksheet.mergeCells(`B${row.number}:C${row.number}`);
      row.getCell('A').alignment = { horizontal: 'center' };
      row.getCell('D').alignment = { horizontal: 'center' };
      row.getCell('E').alignment = { horizontal: 'center' };
      row.getCell('F').numFmt = '#,##0';
      row.getCell('G').numFmt = '#,##0';
      row.eachCell({includeEmpty: true}, (cell) => {
        // Luôn áp dụng border cho tất cả các ô trong hàng sản phẩm (A-H)
        setBorder(cell);
      });
    });

    // --- Tổng kết ---
    const totalRow = worksheet.addRow([]);
    worksheet.mergeCells(`A${totalRow.number}:C${totalRow.number}`);
    const totalQtyCell = worksheet.getCell(`A${totalRow.number}`);
    totalQtyCell.value = `Tổng số lượng: ${order.totalQty}`;
    
    worksheet.mergeCells(`D${totalRow.number}:H${totalRow.number}`);
    const totalAmountCell = worksheet.getCell(`D${totalRow.number}`);
    totalAmountCell.value = `Tổng tiền hàng: ${order.totalAmount.toLocaleString()} VND`;
    
    totalRow.eachCell({ includeEmpty: true }, cell => {
      if(cell.value){
        cell.border = thinBorder;
        cell.alignment = { vertical: 'middle' };
      }
    });

    // --- Ký nhận ---
    const signatureStartRow = worksheet.lastRow.number + 1;
    // Thêm 3 hàng trống để gộp ô cho khu vực chữ ký
    worksheet.addRows([[], [], []]);

    worksheet.mergeCells(`A${signatureStartRow}:D${signatureStartRow + 2}`);
    worksheet.mergeCells(`E${signatureStartRow}:H${signatureStartRow + 2}`);

    const nguoiNhanCell = worksheet.getCell(`A${signatureStartRow}`);
    nguoiNhanCell.value = `Người nhận hàng`;

    const nguoiTienCell = worksheet.getCell(`E${signatureStartRow}`);
    nguoiTienCell.value = `Người nhận tiền`;

    [nguoiNhanCell, nguoiTienCell].forEach(cell => {
      cell.border = thinBorder;
      cell.alignment = { horizontal: 'center', vertical: 'top' };
    });
    
    // --- Footer ---
    const footerRow1 = worksheet.addRow([]);
    worksheet.mergeCells(`A${footerRow1.number}:H${footerRow1.number}`);
    const footerCell1 = worksheet.getCell(`A${footerRow1.number}`);
    footerCell1.value = `Số điện thoại (zalo):${order.phone}  Địa chỉ: ${order.deliveryAddress}`;
    footerCell1.border = thinBorder;

    const footerRow2 = worksheet.addRow([]);
    worksheet.mergeCells(`A${footerRow2.number}:B${footerRow2.number}`);
    worksheet.getCell(`A${footerRow2.number}`).value = 'Lấy hàng:';
    worksheet.getCell(`C${footerRow2.number}`).value = 'Kiểm hàng:';
    worksheet.mergeCells(`D${footerRow2.number}:F${footerRow2.number}`);
    worksheet.getCell(`D${footerRow2.number}`).value = 'Đóng bao:';
    worksheet.mergeCells(`G${footerRow2.number}:H${footerRow2.number}`);
    worksheet.getCell(`G${footerRow2.number}`).value = 'Giao hàng:';
    footerRow2.eachCell({ includeEmpty: true }, (cell)=>{
        if(cell.value) setBorder(cell);
    });
    
    // --- Thiết lập font chữ Times New Roman cho toàn bộ file ---
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        // Giữ lại các thuộc tính font đã có và chỉ định font chữ
        cell.font = { ...(cell.font || {}), name: 'Times New Roman' };
      });
    });

    // --- Xuất file ---
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `PhieuXuatKho.xlsx`);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-display font-bold text-dessert-primary">Quản lý đơn hàng</h1>
      </div>
      <Card className="shadow-card rounded-2xl border-0">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <CardTitle className="text-lg font-semibold text-dessert-dark">Danh sách đơn hàng</CardTitle>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm mã đơn, S.O, khách hàng..."
                className="pl-10 w-full"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-dessert-cream/80 dark:bg-dessert-dark/80">
                <tr>
                  <th className="p-3 text-left font-semibold">Mã đơn</th>
                  <th className="p-3 text-left font-semibold">Khách hàng</th>
                  <th className="p-3 text-left font-semibold">Số điện thoại</th>
                  <th className="p-3 text-left font-semibold">Địa chỉ</th>
                  <th className="p-3 text-left font-semibold">Ngày</th>
                  <th className="p-3 text-right font-semibold">Tổng SL</th>
                  <th className="p-3 text-right font-semibold">Tổng tiền</th>
                  <th className="p-3 text-center font-semibold">Xuất Excel</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-dessert-secondary/40 transition-colors">
                    <td className="p-3 font-bold text-dessert-primary">{order.id}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">{order.phone}</td>
                    <td className="p-3">{order.address}</td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3 text-right">{order.totalQty}</td>
                    <td className="p-3 text-right font-semibold text-dessert-accent">{order.totalAmount.toLocaleString()}đ</td>
                    <td className="p-3 text-center">
                      <Button size="icon" variant="outline" onClick={() => exportExcel(order)} title="Xuất Excel">
                        <Download className="h-5 w-5 text-dessert-primary" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersPage;