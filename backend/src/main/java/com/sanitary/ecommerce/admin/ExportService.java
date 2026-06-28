package com.sanitary.ecommerce.admin;

import com.sanitary.ecommerce.order.entity.Order;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportService {

    public ByteArrayInputStream exportRevenueExcel(List<Order> orders) throws IOException {
        String[] columns = {"Mã Đơn Hàng", "Ngày Tạo", "Khách Hàng", "Phương Thức", "Trạng Thái", "Tổng Tiền"};

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Bao Cao Doanh Thu");

            // Header Font & Style
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);

            // Row for Header
            Row headerRow = sheet.createRow(0);

            // Creating Header Cells
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            int rowIdx = 1;
            BigDecimal grandTotal = BigDecimal.ZERO;
            for (Order order : orders) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(order.getOrderCode());
                
                String dateStr = order.getCreatedAt() != null ? order.getCreatedAt().format(formatter) : "";
                row.createCell(1).setCellValue(dateStr);
                
                row.createCell(2).setCellValue(order.getCustomerName() != null ? order.getCustomerName() : "Khách vãng lai");
                row.createCell(3).setCellValue(order.getPaymentMethod());
                row.createCell(4).setCellValue(order.getStatus());
                
                Cell totalCell = row.createCell(5);
                totalCell.setCellValue(order.getTotal().doubleValue());
                
                grandTotal = grandTotal.add(order.getTotal());
            }

            // Total Row
            Row totalRow = sheet.createRow(rowIdx);
            Cell totalLabelCell = totalRow.createCell(4);
            totalLabelCell.setCellValue("Tổng Cộng:");
            CellStyle boldStyle = workbook.createCellStyle();
            Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            boldStyle.setFont(boldFont);
            totalLabelCell.setCellStyle(boldStyle);

            Cell totalValCell = totalRow.createCell(5);
            totalValCell.setCellValue(grandTotal.doubleValue());
            totalValCell.setCellStyle(boldStyle);

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream exportRevenuePdf(List<Order> orders) {
        com.lowagie.text.Document document = new com.lowagie.text.Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            com.lowagie.text.pdf.PdfWriter.getInstance(document, out);
            document.open();

            com.lowagie.text.pdf.BaseFont baseFont = getVietnameseBaseFont();
            com.lowagie.text.Font titleFont = new com.lowagie.text.Font(baseFont, 18, com.lowagie.text.Font.BOLD);
            com.lowagie.text.Font normalFont = new com.lowagie.text.Font(baseFont, 12, com.lowagie.text.Font.NORMAL);
            com.lowagie.text.Font boldFont = new com.lowagie.text.Font(baseFont, 12, com.lowagie.text.Font.BOLD);

            // Title
            com.lowagie.text.Paragraph title = new com.lowagie.text.Paragraph("BÁO CÁO THỐNG KÊ DOANH THU", titleFont);
            title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Info
            com.lowagie.text.Paragraph info = new com.lowagie.text.Paragraph("Ngày xuất báo cáo: " + java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), normalFont);
            info.setSpacingAfter(20);
            document.add(info);

            // Table
            com.lowagie.text.Table table = new com.lowagie.text.Table(5);
            table.setWidth(100);
            table.setPadding(5);

            // Headers
            String[] headers = {"Mã Đơn Hàng", "Ngày Tạo", "Khách Hàng", "Trạng Trí", "Tổng Tiền"};
            // Note: Header name fix 'Trạng Trí' -> 'Trạng Thái'
            headers[3] = "Trạng Thái";
            for (String header : headers) {
                com.lowagie.text.Cell cell = new com.lowagie.text.Cell(new com.lowagie.text.Paragraph(header, boldFont));
                cell.setHeader(true);
                cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                cell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            BigDecimal grandTotal = BigDecimal.ZERO;
            
            for (Order order : orders) {
                table.addCell(new com.lowagie.text.Cell(new com.lowagie.text.Paragraph(order.getOrderCode(), normalFont)));
                
                String dateStr = order.getCreatedAt() != null ? order.getCreatedAt().format(formatter) : "";
                table.addCell(new com.lowagie.text.Cell(new com.lowagie.text.Paragraph(dateStr, normalFont)));
                
                String customerName = order.getCustomerName() != null ? order.getCustomerName() : "Khách vãng lai";
                table.addCell(new com.lowagie.text.Cell(new com.lowagie.text.Paragraph(customerName, normalFont)));
                
                table.addCell(new com.lowagie.text.Cell(new com.lowagie.text.Paragraph(order.getStatus(), normalFont)));
                
                table.addCell(new com.lowagie.text.Cell(new com.lowagie.text.Paragraph(String.format("%,.0f đ", order.getTotal()), normalFont)));
                
                grandTotal = grandTotal.add(order.getTotal());
            }

            document.add(table);

            // Summary
            com.lowagie.text.Paragraph summary = new com.lowagie.text.Paragraph(
                    "\nTổng doanh thu: " + String.format("%,.0f đ", grandTotal), boldFont);
            summary.setAlignment(com.lowagie.text.Element.ALIGN_RIGHT);
            document.add(summary);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private com.lowagie.text.pdf.BaseFont getVietnameseBaseFont() {
        String[] fontPaths = {
            "C:\\Windows\\Fonts\\arial.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/msttcorefonts/Arial.ttf",
            "/usr/share/fonts/liberation/LiberationSans-Regular.ttf",
            "/Library/Fonts/Arial.ttf"
        };
        for (String path : fontPaths) {
            java.io.File file = new java.io.File(path);
            if (file.exists()) {
                try {
                    return com.lowagie.text.pdf.BaseFont.createFont(path, com.lowagie.text.pdf.BaseFont.IDENTITY_H, com.lowagie.text.pdf.BaseFont.EMBEDDED);
                } catch (Exception e) {
                    // Try next
                }
            }
        }
        try {
            return com.lowagie.text.pdf.BaseFont.createFont(com.lowagie.text.pdf.BaseFont.HELVETICA, com.lowagie.text.pdf.BaseFont.CP1252, com.lowagie.text.pdf.BaseFont.NOT_EMBEDDED);
        } catch (Exception e) {
            throw new RuntimeException("Could not create fallback font", e);
        }
    }
}
