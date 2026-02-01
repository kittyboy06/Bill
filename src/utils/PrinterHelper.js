export const PrinterLogic = {
    // ASCII Constants
    ESC: 0x1B,
    GS: 0x1D,
    LF: 0x0A,

    // Commands
    INIT: [0x1B, 0x40],
    ALIGN_LEFT: [0x1B, 0x61, 0x00],
    ALIGN_CENTER: [0x1B, 0x61, 0x01],
    ALIGN_RIGHT: [0x1B, 0x61, 0x02],
    BOLD_ON: [0x1B, 0x45, 0x01],
    BOLD_OFF: [0x1B, 0x45, 0x00],
    CUT_PAPER: [0x1D, 0x56, 0x41, 0x00],

    generateReceipt: function (cartItems, totalAmount, taxAmount = 0) {
        const buffer = [];
        const encoder = new TextEncoder();

        const addBytes = (bytes) => buffer.push(...bytes);
        const addText = (text) => addBytes(encoder.encode(text));
        const addLine = (text) => addBytes(encoder.encode(text + '\n'));

        // Initialize
        addBytes(this.INIT);

        // Header
        addBytes(this.ALIGN_CENTER);
        addBytes(this.BOLD_ON);
        addLine("HOTEL DELICIOUS"); // Example Name
        addBytes(this.BOLD_OFF);
        addLine("123 Food Street, City");
        addLine("Tel: 9876543210");
        addBytes(this.INIT); // Reset align

        addLine("-".repeat(32)); // Separator (approx for 58mm)

        // Headers: Item | Qty | Price
        addBytes(this.BOLD_ON);
        addLine("Item           Qty   Price(Rs)");
        addBytes(this.BOLD_OFF);
        addLine("-".repeat(32));

        // Items
        cartItems.forEach(item => {
            let name = item.product_name.substring(0, 14).padEnd(14, ' ');
            let qty = item.quantity.toString().padStart(3, ' ');
            let price = (item.sales_price * item.quantity).toFixed(2).padStart(8, ' ');
            addLine(`${name} ${qty} ${price}`);
        });

        addLine("-".repeat(32));

        // Footer
        addBytes(this.ALIGN_RIGHT);
        addBytes(this.BOLD_ON);

        let subtotal = (totalAmount - taxAmount).toFixed(2);
        let tax = taxAmount.toFixed(2);
        let total = totalAmount.toFixed(2);

        addLine(`Subtotal: ${subtotal}`);
        addLine(`Tax: ${tax}`);

        // Grand Total Enlarge
        addBytes([0x1D, 0x21, 0x11]); // Double height/width
        addLine(`TOTAL: Rs. ${total}`);
        addBytes([0x1D, 0x21, 0x00]); // Reset size

        addBytes(this.BOLD_OFF);
        addBytes(this.ALIGN_CENTER);
        addLine("Thank you! Visit Again.");
        addLine("\n\n"); // Feed

        // Cut
        addBytes(this.CUT_PAPER);

        return new Uint8Array(buffer);
    }
};

