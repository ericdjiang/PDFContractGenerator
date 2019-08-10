$(function() {
	// initialize signature pad
	var canvas = document.querySelector("canvas");
	var signaturePad = new SignaturePad(canvas);

	$( "#submit_button" ).click(function() {
		// extract inputs
		var map_raw = {};
		$(".inp").each(function() {
		    map_raw[$(this).attr("name")] = $(this).val();
		});

		if(datacheck(signaturePad, map_raw)){
			// clean up mapping dictionary
			var map = {}
			map['Name'] = map_raw['first_name'] + " " + map_raw['last_name'];
			map['Email'] = map_raw['Email'];
			map['Date of Birth'] = map_raw['month'] + " " + map_raw['day'] + ", " + map_raw['year'];
			map['Address'] = [map_raw['address_line_1'], map_raw['city'] + ", " + map_raw['state'] + " " + map_raw['zip']];
			map['Store Name'] = map_raw['Store Name'];
			map['Store Email'] = map_raw['Store Email'];

			// initialize PDF and offsets
			var doc = new jsPDF();
			// for consignment terms of use
			p1_y = 17;
			// for horizontal lines
			hr_x1 = 10;
			hr_x2 = 200;
			hr_y = p1_y+3;
			// for contact info
			off_x1 = 12;
			off_x2 = 75;
			off_y = hr_y+6;

			doc.setFontSize(14);
			doc.setFont("Helvetica", "bold");
			doc.text("Consignment Terms of Use", 12,p1_y);

			// Add contact information
			doc.setDrawColor(150);
			doc.setFontSize(10);
			doc.line(hr_x1, hr_y, hr_x2, hr_y);

			$.each(map,function(index,value){ 
				doc.setFont("Helvetica", "bold");
				doc.text(index, off_x1, off_y);
				doc.setFont("Helvetica", "normal");
				doc.text(value, off_x2, off_y);

				off_y+=10;
				hr_y+=10;	
				
				if (Array.isArray(value)) {
					off_y+=4;
					hr_y+=4;
				}

				doc.line(hr_x1, hr_y, hr_x2, hr_y);
			});


			// add terms of agreement paragraphs
			doc.addPage();

			var head_y = 17;
			doc.setFontSize(10);
			doc.setFont("Helvetica", "bold");
			doc.text('Contract Terms & Agreement', 14, head_y);
			doc.setFont("Helvetica", "normal");
			
			var pages = [page2, page3, page4, page5];
			
			for (var i = 0; i < pages.length; i++) {
				if (i!=0)	doc.addPage();
				doc.text(pages[i], off_x2, head_y);
			}

			// add last page
			doc.addPage();

			hr_y = 5;
			off_y = hr_y+6;
			
			doc.setDrawColor(150);
			doc.setFontSize(10);

			doc.setFont("Helvetica", "bold");
			doc.text(["I agree to the terms outlined in", "this contract"], off_x1, off_y);
			doc.setFont("Helvetica", "normal");
			doc.text("Yes", off_x2, off_y);
			off_y+=12;
			hr_y+=12;
			doc.line(hr_x1, hr_y, hr_x2, hr_y);

			// add signature
			signature_raw = signaturePad.toDataURL();

			doc.setFont("Helvetica", "bold");
			doc.text(["Signature [Signing signifies your", "agreement to the above contract]"], off_x1, off_y);
			doc.setFont("Helvetica", "normal");
			doc.addImage(signature_raw, off_x2, off_y);
			off_y+=12;
			hr_y+=30;
			doc.line(hr_x1, hr_y, hr_x2, hr_y);

			pdf_raw = doc.output('datauristring');
			console.log(pdf_raw);
			doc.save("yo.pdf");

			// signature_raw = signaturePad.toDataURL();

			// // generate PDF
			// var doc = new jsPDF();

			// doc.text(first_name, 10, 10);
			// doc.addImage(signature_raw, 10, 10);

			// // convert PDF to base64 and download PDF
		 //    pdf_raw = doc.output('datauristring');
		 //    doc.save('test1.pdf')
		 //    console.log(pdf_raw);	
		}
	});


	// check if all form elements have been filled out
	function datacheck(signaturePad, map) {
		// if(Array.from(arguments).includes("")){
		// 	console.log('Please fill out all required fields.');
		// 	return false;
		// }
		var form_complete = true;
		$.each(map,function(index,value){ 
		    if(value == "")	form_complete = false;
		});

		if(form_complete==false){
	    	$("#notify").html('Please fill out all fields');
	    	return false;
		}

		if (signaturePad.isEmpty()){
			$("#notify").html('Please sign the document.');
			return false;
		}
		$("#notify").html("Generating PDF");
		return true;
	}
});

var page2 = `SG Seller Agreement

1. Agreement.
These Agreement governs our relationship concerning all footwear and
other goods (collectively, the "Goods") which you deliver to Stadium
Enterprises, LLC ("we" or "us"), and which we accept for sale on
consignment. We reserve the right in our sole and absolute discretion to
accept or reject any or all Goods which you may deliver to us without any
liability to you. If we accept your Goods for consignment, we will issue to
you a confirmation for each item stating the quantity and description of
such Goods and the minimum sale price and our approximate anticipated
commission rate with respect to such Goods (each a "Confirmation"). You
have twenty four hours after we send you the Confirmation to notify us of
any discrepancies. Each final Confirmation shall be considered an Exhibit
to this Agreement. If we reject any Goods, they shall be put aside and
available for pick-up by you for a period of seven (7) days, after which we
may dispose of them without our incurring any liability to you. In the
alternative, if you provide us a credit card or other form of prepayment for
shipping and handling costs, we will return the Goods to you via FedEx or
comparable carrier.


2. Owner Representations.
With respect to all Goods that you deliver to us, you represent and warrant
that: (i) you are the valid and lawful owner of the Goods with the full legal
right to offer and sell them, and to enter into this Consignment Agreement;
(ii) you are 18 years of age or older and a resident of the United States or,
if you are under 18 years of age, your parent or guardian confirms these
representations and this agreement; (iii) none of the Goods are subject to
any lien, encumbrance, security interest or other adverse claim; and (iv) all
of the Goods are genuine and authentic, and conform to the description
stated in the applicable Confirmation. If we believe in good faith that any of
the Goods are counterfeit or otherwise unlawful, we shall notify you and
destroy them without our incurring any liability to you, even if you challenge
our determination or our determination is later found to have bene wrong so
long as it was made in good faith.


3. Sales Efforts.
Subject only to the minimum sales price stated in the Confirmation, we may
offer the Goods for sale at such price and in such manner as we deem
appropriate in our sole discretion, including in our retail store and/or on one
or more of our websites or affiliated third party websites. You may lower or
raise the minimum sale price for any Goods which have not yet been sold
at any time on written notice to us, but if you seek to raise the minimum
sale price, the new minimum sale price shall be subject to our approval in
our sole discretion. We make no guaranty as to whether, when or at what
price any of the Goods may or will be sold, and we shall have no liability in
the event any of the Goods fails to sell, except that we shall not sell the
Goods and pay you less than the minimum sale price you set and to which
we agreed.
`; 

var page3 = `4. Proceeds of Sales.
If, as and when Goods are sold and proceeds are actually received by us,
we will apply them as follows: (i) first, to the payment of any applicable sale
and other taxes, (ii) next, to pay our commission, which may vary by Goods
sold and the manner in which they are sold; and (iii) finally, the balance to
you, which shall not be less than the minimum sale price. We will notify you
promptly upon the later of (a) our receipt of proceeds from the sale of
Goods, or (b) the conclusion of the period within which the customer may
make any claims regarding the Goods, and we will thereafter pay you your
share of the proceeds at our store premises during normal business hours
on a set date, upon your presentation of the applicable Confirmation and
your driver's license or other satisfactory government issued photo
identification. We may require you to sign a document confirming your
receipt of the amount that we are then paying to you. In the alternative, at
your option, we will provide you store credit at no extra charge or, for an
additional fee, we will send you a check via FedEx or comparable carrier
for the amount due or issue credit to a credit card you have provided us. If
you later request a replacement check for any reason, we will stop payment
on our original check. After a waiting period of at least 45 days, and
provided that the original check has not been negotiated, we will issue a
replacement check for the original amount less the cost of the stop
payment order and issuance of the new check.

5. Withdrawal of Goods.
Either you or we may, at any time, elect to withdraw any or all of Goods
which have not yet been sold, and will notify the other in writing of the
decision to do so. In such event, you will be responsible for picking up the
Goods at our premises during normal business hours, at which time you
must present the applicable Confirmation together with your driver's license
or other government-issued photo identification, or otherwise arranging for
return shipping, which must be prepaid by you. We may require you to sign
a receipt confirming the delivery of the returned Goods to you in
satisfactory condition.

6. Title to Goods.
At all times prior to our sale of Goods, title to and ownership of such Goods
will remain with you, except that we have full authority to effect the sale of
such Goods in accordance with the terms of this Agreement.

7. Storage of Goods.
We shall store the Goods in such a manner as to protect them from
damage or deterioration and shall clearly identify them as your property.

8. Risk of Loss.
We will use reasonable care in the handling, display and storage of your
Goods. However, in the event any of the Goods are lost, stolen, or are
damaged or destroyed by fire, flood, customer handling or other causes
beyond our reasonable control, the risk of loss remains with you, and we
assume no responsibility or obligation to make any payment or
reimbursement in respect of any such loss or damage, or for any special or
consequential damages, except to the extent of any insurance proceeds
that we actually collect in respect of such Goods. We make no
representation or assurance that we will have insurance coverage for your
Goods, or that, if we do, our insurance will provide coverage for the Goods,
or for the amount which any insurer may pay in respect of any casualty
relating to the Goods.
`;

var page4 = `9. Customer Returns or Adjustments.
From time to time, purchasers may make claims or seek adjustments
arising from defects or other claimed deficiencies of the Goods. We reserve
the right, in our reasonable judgment, to make allowances and/or accept
returns of Goods, and in such circumstances, such allowances or returns
will be treated as an adjustment to the net proceeds for purposes of
calculating our respective shares of net proceeds as set forth in paragraph
4 above.

10. Mail-In Consignors.
To the extent that you provide us with Goods other than by in-person
delivery at our retail store or such other location as we may elect from time
to time, you and we will nonetheless endeavor to implement these Terms
and Conditions as closely as possible, including (a) the issuance of
Confirmations by mail, overnight courier or e- mail, notification of sale by
mail or e-mail, transmittal of payment checks to you by Fed Ex or first class
United States mail to your address indicated above (or such other address
as you may notify us of in writing), and return of any unaccepted or unsold
Goods to you by such means as you designate (with all shipping charges to
be pre-paid for by you.)

11. Confidentiality.
From time to time during the term of this Agreement, each of us (as the
"Disclosing Party") may disclose or make available to the other (as the
"Receiving Party") information about its business affairs, goods and
services, forecasts, confidential information and materials comprising or
relating to intellectual property rights, trade secrets, third-party confidential
information and other sensitive or proprietary information. Such information,
as well as the terms of this Agreement, whether orally or in written,
electronic or other form or media, and whether or not marked, designated
or otherwise identified as "confidential" constitutes "Confidential
Information" hereunder. Notwithstanding the foregoing, Confidential
Information does not include information that, at the time of disclosure: (i) is
or becomes generally available to and known by the public other than
resulting from, directly or indirectly, any breach of this Section by the
Receiving Party or any of its representatives; (ii) is or becomes available to
the Receiving Party on a non-confidential basis from a third- party source,
provided that the third party is not and was not prohibited from disclosing
the Confidential Information; (iii) was known by or in the possession of the
Receiving Party or its representatives before being disclosed by or on
behalf of the Disclosing Party; (iv) was or is independently developed by
the Receiving Party without reference to or use of, in whole or in part, any
of the Disclosing Party's Confidential Information; or (v) must be disclosed
under applicable law. The Receiving Party shall, for three (3) years from
receipt of the Confidential Information: (1) protect and safeguard the
confidentiality of the Disclosing Party's Confidential Information with at least
the same degree of care as the Receiving Party would protect its own
Confidential Information, but in no event with less than a commercially
reasonable degree of care; (ii) not use the Disclosing Party's Confidential
Information, or permit it to be accessed or used, for any purpose other than
to exercise its rights or perform its obligations under this Agreement; and
(iii) not disclose any the Confidential Information to any Person, except to
the Receiving Party's representatives who must know the Confidential
Information to assist the Receiving Party, or act on its behalf, to exercise its
rights or perform its obligations under this Agreement.
`;

var page5 = `12. Indemnity.
You shall indemnify, hold harmless, and defend us and our parent, officers,
directors, partners, members, shareholders, employees, agents, affiliates,
successors and permitted assigns (collectively, "Indemnified Party") against
any and all losses, damages, liabilities, deficiencies, claims, actions,
judgments, settlements, interest, awards, penalties, fines, costs, or
expenses of whatever kind, including reasonable attorneys' fees, fees and
the costs of enforcing any right to indemnification under this Agreement
and the cost of pursuing any insurance providers (collectively, "Losses"),
incurred by an Indemnified Party arising out of or relating to, or resulting
from any claim, action, cause of action, demand, lawsuit, arbitration,
inquiry, audit, notice of violation, proceeding, litigation, citation, summons,
subpoena or investigation of any nature, civil, criminal, administrative,
regulatory or other, whether at law, in equity or otherwise (collectively,
"Claim") of a third party: (i) relating to a breach of any representation,
warranty or covenant made by you un this Agreement; (ii) alleging or
relating to any act or omission by you in connection with the performance of
your obligations under this Agreement; (iii) alleging or relating to any bodily
injury, death of any person or damage to real or tangible personal property
caused by your acts or omissions or (iv) relating to any failure by you to
comply with any applicable laws.

13. Limitation of Liability.
IN NO EVENT ARE WE LIABLE TO YOU FOR CONSEQUENTIAL,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE OR
ENHANCED DAMAGES, LOST PROFITS OR REVENUES OR
DIMINUTION IN VALUE, ARISING OUT OF OR RELATING TO ANY
BREACH OF THIS AGREEMENT, REGARDLESS OF (I) WHETHER THE
DAMAGES WERE FORESEEABLE, (II) WHETHER OR NOT WE WERE
ADVISED OF THE POSSIBILITY OF THE DAMAGES AND (III) THE
LEGAL OR EQUITABLE THEORY (CONTRACT, TORT OR OTHERWISE)
ON WHICH THE CLAIM IS BASED, AND NOTWITHSTANDING THE
FAILURE OF ANY AGREED OR OTHER REMEDY OF ITS ESSENTIAL
PURPOSE. IN NO EVENT SHALL OUR AGGREGATE LIABILITY TO YOU
ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER
ARISING OUT OF OR RELATED TO BREACH OF CONTRACT, TORT
(INCLUDING NEGLIGENCE) OR OTHERWISE, EXCEED THE TOTAL
SUM OF ONE HUNDRED ($100) DOLLARS FOR EACH GOOD.

14. Miscellaneous.
This Agreement constitutes the sole and entire agreement between you
and us regarding the subject matter hereof, and neither you nor we has
made any representation or warranty except as expressly stated above. No
amendment of this Agreement, or any waiver hereunder, will be valid
unless evidenced by a further written agreement signed by you and us.
This Agreement is binding on and enforceable by you and us and your and
our successors and assigns. This Agreement will be governed by and
construed in accordance with the laws of the State of New York. Any
lawsuit or claim arising under this Agreement shall be brought exclusively
in the state or federal courts located in New York, New York, and you and
we consent to the jurisdiction of and venue in such courts.
`;


/*// Don't forget, that there are CORS-Restrictions. So if you want to run it without a Server in your Browser you need to transform the image to a dataURL
// Use http://dataurl.net/#dataurlmaker
var doc = new jsPDF();

doc.setFontSize(13)

hr_y = 10

off_x1 = 12;
off_x2 = 75;
off_y = hr_y + 7;

doc.line(10, hr_y, 200, hr_y);
doc.setFont("Helvetica", "bold");
doc.text("Name", off_x1, off_y);
doc.setFont("Helvetica", "normal");
doc.text("Eric", off_x2, off_y);

off_y+=10;
hr_y+=10;
doc.line(10, hr_y, 200, hr_y);
doc.setFont("Helvetica", "bold");
doc.text("Name", off_x1, off_y);
doc.setFont("Helvetica", "normal");
doc.text("Eric", off_x2, off_y);

doc.addImage(signature_raw, 10, 10);*/