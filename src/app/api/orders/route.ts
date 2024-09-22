import { corsHeaders } from '@/lib';
import supabase from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('X-API-KEY');
  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ status: 401, message: "APIキーが無効です。" });
  }

  const body = await req.json();
  const { userId, destinationName, destinationEmail, destinationZipcode, destinationAddress, destinationTel, deliveryTime, paymentMethod, orderDate, totalPrice, status, orderList } = body;
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status,
      total_price: totalPrice,
      order_date: orderDate,
      destination_name :destinationName,
      destination_email: destinationEmail,
      destination_zipcode: destinationZipcode,
      destination_address: destinationAddress,
      destination_tel: destinationTel,
      delivery_time: deliveryTime,
      payment_method: paymentMethod
    })
    .select();

  if (orderError) {
    return NextResponse.json({ status: 500, message: "注文の保存中にエラーが発生しました。" });
  }

  const orderId = orderData[0].id;
  for (const orderItem of orderList) {
    
    const { productId, size, quantity, toppingIds } = orderItem;

    const { data: orderItemData, error: orderItemError } = await supabase
      .from('order_items')
      .insert({
        item_id: productId,
        order_id: orderId,
        quantity,
        size
      })
      .select();

    if (orderItemError) {
      return NextResponse.json({ status: 500, message: "注文アイテムの保存中にエラーが発生しました。" });
    }

    const orderItemId = orderItemData[0].id;

    for (const toppingId of toppingIds) {
      const { error: orderToppingError } = await supabase
        .from('order_toppings')
        .insert({
          topping_id: toppingId,
          order_item_id: orderItemId
        });

      if (orderToppingError) {
        return NextResponse.json({ status: 500, message: "トッピングの保存中にエラーが発生しました。" });
      }
    }
  }

  return NextResponse.json({ status: 200, message: "注文が正常に保存されました。" }, {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * fetch のプリフライトリクエストに対応するための OPTIONS メソッド
 * @returns 
 */
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: corsHeaders
  })
}