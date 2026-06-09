require('dotenv').config(); // Carga las variables del archivo .env
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Servir archivos estáticos (nuestra página web) desde la carpeta 'public'
app.use(express.static('public'));

// Obtenemos las claves de forma segura desde process.env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Faltan las credenciales de Supabase en el archivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Endpoint principal para registrar visitas y ganar puntos
app.post('/api/transactions/earn', async (req, res) => {
  const { merchantId, customerId, purchaseAmount } = req.body;

  try {
    if (!merchantId || !customerId) {
        return res.status(400).json({ success: false, error: 'merchantId y customerId son requeridos' });
    }

    const { data, error } = await supabase.rpc('process_loyalty_earn', {
      p_merchant_id: merchantId,
      p_customer_id: customerId,
      p_purchase_amount: purchaseAmount || 0
    });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Transacción procesada correctamente',
      result: data
    });

  } catch (error) {
    console.error('Error en la transacción:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Loyalo conectado y corriendo en http://localhost:${PORT}`);
});
