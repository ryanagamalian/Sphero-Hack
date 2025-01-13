console.log("Node.js script is running...");

const noble = require('noble');


// Replace with the actual UUID for the Lightning McQueen device and services
const LIGHTNING_MCCQUEEN_UUID = 'C001USA'; // Replace with your device's UUID
const LED_SERVICE_UUID = 'XXXX'; // node with the UUID for the LED control service
const LED_CHARACTERISTIC_UUID = 'XXXX'; // Replace with the UUID for the LED characteristic

noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    console.log('Bluetooth powered on. Starting scan...');
    noble.startScanning();
  } else {
    console.log('Bluetooth is not enabled or unsupported');
  }
});

noble.on('discover', (peripheral) => {
  if (peripheral.uuid === LIGHTNING_MCCQUEEN_UUID) {
    console.log('Discoverd Device');
    console.log("UUID:", peripheral.uuid);
 //will show all UUISD    noble.stopScanning();

    peripheral.connect((err) => {
      if (err) {
        console.log('Error connecting:', err);
        return;
      }

      console.log('Connected to Lightning McQueen');

      peripheral.discoverServices([LED_SERVICE_UUID], (err, services) => {
        if (err) {
          console.log('Error discovering services:', err);
          return;
        }

        services.forEach(service => {
          console.log('Found Service:', service.uuid);

          service.discoverCharacteristics([LED_CHARACTERISTIC_UUID], (err, characteristics) => {
            if (err) {
              console.log('Error discovering characteristics:', err);
              return;
            }

            characteristics.forEach(characteristic => {
              console.log('Found Characteristic:', characteristic.uuid);

              // Command to set the LED to blue (replace with actual byte values)
              const blueCommand = Buffer.from([0, 0, 255]); // Modify this byte array

              // Send the command to change the LED to blue
              characteristic.write(blueCommand, false, (err) => {
                if (err) {
                  console.log('Error writing to characteristic:', err);
                } else {
                  console.log('Front LED changed to blue');
                }
              });
            });
          });
        });
      });
    });
  }
});