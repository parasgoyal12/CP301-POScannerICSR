const {parse} = require('./controllers/util');

	let text=`GSTIN: 03AAATI7702D1Z8					
						
	PO No: 147-20/ECR/2017/000892/F25/CBME-10100/				21.12.2020	
	"M/s Krishgen BioSystems
Unit Nos.# 318 / 319,, Shah & Nahar,
Off Dr.E.Moses Road,Worli,, , Mumbai - 400018"					
	Subject: Supply of 'Human Endothelial Cell'					
	With reference to the Quotation no. QU/20-21/1926 dt. 19.11.2020, kindly supply the following item to this Institute on the terms and conditions given below:                                                					
	Sl. No.	Item Code	Description	Qty	Rate Per Unit	Amount 
	1	H1168	"Complete Human Endothelial Cell Medium /w Kit
500 ml
Make : Cell Biologics, USA"	1	₹30,500.00	₹30,500.00
	Less: Discount @20%					₹6,100.00
	 Total					₹24,400.00
	(Rupees Twenty Four Thousand Four Hundred Only).					
	Deputy Registrar (ICSR)					
	Terms & Conditions:					
	1. FOR : Department of CBME, Transit Campus, IIT Ropar.					
	2. GST : Extra @5 % concessional GST certificate is enclosed.					
	3. Delivery : Within 01 weeks, positively by 29.12.2020.					
	4. Payment : Within 30 days from the date of successful delivery.					
	5. Liquidated damages : Being an educational Institute time is essence of the order. Date of the delivery should be strictly adhered to, otherwise, this Institute reserves the right not to accept the delivery in part or full. The liquidated damages @1% per week subject to a maximum of 10% value of the order can be imposed.					
	6. Jurisdiction: The Courts of Ropar alone will have the jurisdiction to try any matter, dispute or difference between the parties arising out of this tender/contract.  It is specifically agreed that no Court outside and other than Ropar court shall have jurisdiction in the matter.					
	NOTE:Items will be received by the department and bill of the same will be send to ICSR section for further processing.					
	CC to :					
	1. Dr. Durba Pal, Assistant Professor, CBME Deptt, PI of the project					
	2. ICSR Accounts					
	3. Master File`;

    console.log(parse(text));
