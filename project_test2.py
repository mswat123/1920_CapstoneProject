from pyjector import Pyjector

# Look up what port your projector is connected to, using something
# like `dmesg` if you're on linux.
port = '/dev/ttyUSB0'

# The only valid device id at the moment is `benq`. This is used
# to figure out what commands are supported, and the format needed.
device_id = 'benq'

pyjector = Pyjector(port=port, device_id=device_id)

# Let's check what commands claim to be supported by our device.
print(pyjector.command_list)

# Let's check the actions associated with each command
print(pyjector.command_spec)

# Turn the projector on
pyjector.power('on')
# We need to change the source, which are supported?
print(pyjector.get_actions_for_command('source'))
# Change the source to hdmi-2
pyjector.source('hdmi_2')
# It's too loud!
pyjector.volume('down')
# We're done here
pyjector.power('off')

# We can also interact directly with the underlying `PySerial` instance
pyjector.serial.write('some other command here')