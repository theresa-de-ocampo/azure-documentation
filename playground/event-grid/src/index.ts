import authenticateToEventGrid from "./client.js";
import "dotenv/config";

async function createOrder(request: {
  product: { id: string; count: Number };
  customer: { name: string; address: string };
}) {
  const {
    product: { id, count }
  } = request;
  // Do some order processing first, then update the inventory
  await updateInventory(id, count);
}

async function updateInventory(_productId: string, _count: Number) {
  // Fecth database record, and update stock count
  const updatedProduct = {
    id: "2124816",
    title: "Sunsera Blend",
    category: "Coffee",
    shipment_label: "SB",
    stock: 0
  };

  if (updatedProduct.stock === 0) {
    const client = authenticateToEventGrid();
    await client.send([
      {
        subject: "Product",
        eventType: "OutOfStock",
        data: {
          id: updatedProduct.id,
          title: updatedProduct.title
        },
        dataVersion: "1.0"
      }
    ]);

    console.log("Done");
  }
}

const payload = {
  product: {
    id: "2124816",
    count: 1
  },
  customer: {
    name: "Teriz De Ocampo",
    address: "Cavite"
  }
};

createOrder(payload);
