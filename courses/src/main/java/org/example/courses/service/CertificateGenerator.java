package org.example.courses.service;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.OffsetDateTime;

@Component
public class CertificateGenerator {

    public GeneratedCertificate generate(String userId, String courseTitle) {
        byte[] pdf = generatePdfBytes(userId, courseTitle);
        String hash = sha256Hex(pdf);
        return new GeneratedCertificate(pdf, hash, OffsetDateTime.now());
    }

    private byte[] generatePdfBytes(String userId, String courseTitle) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph("Certificate of Completion"));
            document.add(new Paragraph("User: " + userId));
            document.add(new Paragraph("Course: " + courseTitle));
            document.add(new Paragraph("Issued at: " + OffsetDateTime.now()));
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate PDF", e);
        }
    }

    private String sha256Hex(byte[] bytes) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(bytes);
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to hash certificate", e);
        }
    }

    public record GeneratedCertificate(byte[] pdfBytes, String hash, OffsetDateTime issueDate) {}
}

