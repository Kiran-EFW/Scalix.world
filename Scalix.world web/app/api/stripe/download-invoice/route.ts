import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get('invoice_id')

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 })
    }

    // In production, you would fetch the actual invoice from Stripe
    // const invoice = await stripe.invoices.retrieve(invoiceId)

    // For now, we'll create a mock PDF response
    // In a real implementation, you might use a library like pdfkit or puppeteer to generate PDFs

    const mockInvoiceData = {
      id: invoiceId,
      number: `INV-2025-${invoiceId.slice(-3)}`,
      amount: 45.80,
      date: '2025-09-01',
      period: 'Sep 1 - Sep 30, 2025',
      items: [
        {
          description: 'Scalix Pro Subscription',
          amount: 29.99,
          quantity: 1
        },
        {
          description: 'AI Token Usage (GPT-4)',
          amount: 15.81,
          quantity: 1
        }
      ],
      customer: {
        name: 'Scalix Admin',
        email: 'admin@scalix.world'
      }
    }

    // Create a simple HTML template for the invoice
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${mockInvoiceData.number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .billing-info { margin-bottom: 30px; }
          .items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items th, .items td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .items th { background-color: #f5f5f5; }
          .total { text-align: right; font-weight: bold; font-size: 18px; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Scalix</h1>
          <h2>Invoice</h2>
        </div>

        <div class="invoice-details">
          <div>
            <h3>Invoice Number: ${mockInvoiceData.number}</h3>
            <p>Invoice Date: ${new Date(mockInvoiceData.date).toLocaleDateString()}</p>
            <p>Billing Period: ${mockInvoiceData.period}</p>
          </div>
          <div>
            <h3>Bill To:</h3>
            <p>${mockInvoiceData.customer.name}</p>
            <p>${mockInvoiceData.customer.email}</p>
          </div>
        </div>

        <div class="billing-info">
          <h3>Items</h3>
          <table class="items">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${mockInvoiceData.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            <p>Total: $${mockInvoiceData.amount.toFixed(2)}</p>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for using Scalix!</p>
          <p>For questions about this invoice, please contact support@scalix.world</p>
        </div>
      </body>
      </html>
    `

    // Return HTML response that can be used to generate PDF
    return new NextResponse(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="invoice-${mockInvoiceData.number}.html"`
      }
    })

  } catch (error) {
    console.error('Error downloading invoice:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
