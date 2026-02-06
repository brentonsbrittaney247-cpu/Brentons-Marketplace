const shippo = require('shippo')(process.env.SHIPPO_API_KEY);

class ShippingService {
  static async generateLabel(transaction, buyerAddress, sellerAddress) {
    try {
      // Create shipment
      const shipment = await shippo.shipment.create({
        address_from: {
          name: sellerAddress.name,
          street1: sellerAddress.street1,
          city: sellerAddress.city,
          state: sellerAddress.state,
          zip: sellerAddress.zip,
          country: 'US'
        },
        address_to: {
          name: buyerAddress.name,
          street1: buyerAddress.street1,
          city: buyerAddress.city,
          state: buyerAddress.state,
          zip: buyerAddress.zip,
          country: 'US'
        },
        parcels: [{
          length: '10',
          width: '8',
          height: '4',
          distance_unit: 'in',
          weight: '2',
          mass_unit: 'lb'
        }],
        async: false
      });

      // Get cheapest rate
      const rate = shipment.rates[0];

      // Purchase label
      const purchasedLabel = await shippo.transaction.create({
        rate: rate.object_id,
        label_file_type: 'PDF',
        async: false
      });

      return {
        url: purchasedLabel.label_url,
        trackingNumber: purchasedLabel.tracking_number,
        labelId: purchasedLabel.object_id,
        cost: parseFloat(rate.amount) || 0
      };
    } catch (error) {
      console.error('Shipping label generation failed:', error);
      throw new Error('Failed to generate shipping label');
    }
  }
}

module.exports = ShippingService;
