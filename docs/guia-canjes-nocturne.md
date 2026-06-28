# Guia de canjes Nocturne

## Flujo del cliente

1. El cliente entra a su perfil con su Codigo Nocturne o escaneando un QR valido.
2. Elige un producto canjeable: Tote Bag, Camisa personalizada o Hoodie.
3. Si tiene puntos suficientes, toca `Canjear ahora`.
4. El sistema descuenta los puntos y crea una solicitud en estado `PENDING`.
5. Se abre WhatsApp con un mensaje listo para enviar a Nocturne con:
   - nombre del cliente
   - Codigo Nocturne
   - telefono y email si existen
   - producto solicitado
   - puntos usados
   - balance restante
   - ID interno del canje
6. El cliente puede revisar el estado desde su perfil:
   - `Pendiente`: solicitud recibida, falta validacion.
   - `Aprobado`: Nocturne valido el canje; el cliente puede coordinar entrega.
   - `Entregado`: el producto ya fue retirado; el canje ya no se reutiliza.
   - `Cancelado`: el canje fue rechazado o anulado; los puntos se devuelven si aplica.

WhatsApp no permite enviar mensajes sin confirmacion del usuario desde un sitio web normal. Por eso el sistema abre el chat con el mensaje prellenado y tambien deja un boton `Enviar WhatsApp` en el canje pendiente si el navegador bloquea la ventana.

## Flujo del admin

1. Entrar a `/admin/canjes`.
2. Revisar los canjes nuevos en estado `PENDING`.
3. Confirmar por WhatsApp:
   - que el Codigo Nocturne coincide con el cliente;
   - que el producto solicitado existe;
   - que hay inventario disponible;
   - que el canje no aparece como `COMPLETED`.
4. Si todo esta correcto, tocar `Aprobar`.
5. Cuando el cliente retire o se entregue el producto, tocar `Completar`.
6. Si no hay inventario, el cliente no confirma, o hay un error, tocar `Cancelar`.

Al cancelar un canje, el sistema devuelve los puntos al cliente y registra el movimiento en su historial.

## Reglas de seguridad

- Un QR solo suma puntos una vez.
- Un canje solo se crea si el cliente esta activo y tiene puntos suficientes.
- El descuento de puntos se hace en una transaccion serializable para evitar doble gasto.
- El perfil del cliente solo abre con una sesion valida del mismo Codigo Nocturne.
- El admin valida el producto antes de marcar `APPROVED` y solo marca `COMPLETED` cuando el producto fue entregado.

## Implementacion actual

- Recompensas publicas: `lib/rewards.ts`.
- Constantes de contacto: `lib/company.ts`.
- Mensaje WhatsApp: `lib/whatsapp.ts`.
- Canje publico: `app/api/public/redeem/route.ts`.
- Debito atomico de puntos: `services/canjes.service.ts`.
- Estados visibles del cliente: `components/public/CustomerProfileClient.tsx`.
- Validacion admin: `app/admin/(panel)/canjes/page.tsx`.
