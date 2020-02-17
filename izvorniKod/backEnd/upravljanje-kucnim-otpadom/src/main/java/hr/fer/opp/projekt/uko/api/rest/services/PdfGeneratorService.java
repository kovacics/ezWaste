package hr.fer.opp.projekt.uko.api.rest.services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfWriter;
import hr.fer.opp.projekt.uko.api.model.enums.FormType;
import hr.fer.opp.projekt.uko.exception.BadRequestException;
import hr.fer.opp.projekt.uko.api.model.Form;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class PdfGeneratorService {

    @Autowired
    private FormsService formsService;

    String appName = "ezWaste";
    public static final String FONT = "resources/times new roman.ttf";


    private static final Logger logger = LoggerFactory.getLogger(PdfGeneratorService.class);

    public ByteArrayInputStream getPdf(int formID) {
        Font font = FontFactory.getFont(FONT, BaseFont.IDENTITY_H, true);
        Form form = formsService.getForm(formID)
                .orElseThrow(() -> new BadRequestException("Cannot create pdf, because form doesn't exist"));
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {

            String formType = "";
            String fileName = "";
            switch (form.getFormType()) {
            case RESOURCE_REQUEST:
                formType = "Zahtjev za dodatnim resursima";
                fileName = "Zahtjev za dodatnim resursima";
                break;
            case COMPLAINT:
                formType = "Pritužbu";
                fileName = "Pritužba";
                break;

            case BULKY_WASTE_COLLECTION:
                formType = "Zahtjev za odvoz glomaznog otpada";
                fileName = "Zahtjev za odvoz glomaznog otpada";
                break;
            }
            PdfWriter.getInstance(document, out);
            document.open();
            //Podnositelj zahtjeva
            document.add(new Paragraph());
            Chunk applicant = new Chunk(formType + " podnosi " + form.getUser().getFirstName() + " " + form.getUser().getLastName() + "\n" +
                    form.getUser().getAddress().getCombined() + "\n\n\n", font);
            document.add(applicant);
            document.addTitle(fileName);
            //naslov
            if (form.getFormType() == FormType.COMPLAINT) {
                Paragraph title = new Paragraph(new Chunk(form.getTitle(), font));
                title.setAlignment(Element.ALIGN_CENTER);
                document.add(title);
            }
            //opis
            document.add(new Paragraph(new Chunk("Opis: " + form.getDescription() + "\n\n\n", font)));

            if (form.getResourceType() != null) {
                document.add(new Paragraph());
                String resurs = null;
                switch (form.getResourceType()) {
                case PLASTIC_BAG:
                    resurs = "Vrecica";
                    break;
                case TRASH_CAN:
                    resurs = "Kanta";
                    break;
                }
                Chunk resourceType = new Chunk("Tip resursa: " + resurs + "\n", font);
                Chunk resourceQuantity = new Chunk("Kolicina: " + form.getResourceQuantity() + "\n\n", font);
                document.add(resourceType);
                document.add(resourceQuantity);
            }

            //ime aplikacije
            Chunk appName = new Chunk("\n\n\n" + this.appName, font);
            Paragraph end = new Paragraph(appName);
            end.setAlignment(Element.ALIGN_RIGHT);
            document.add(end);

            document.close();
        } catch (DocumentException ex) {
            logger.error("Error ocurred: {0}", ex);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
