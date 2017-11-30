# Context
CentOS is one of the Linux platforms we want to test with. Here are some pointers into how we configure CentOS 6.9 ready to install the software we want to test.

# Initial setup
We start with the Minimal Install package of CentOS 6.9. This is either burned to a CD-ROM or installed on a USB drive.

Assume a fresh install, using all the drive. Once the installation has completed and the machine rebooted we can login with the `root` account using the password set in the install process. We start with one account: `root` and no Internet connection.
## Enable networking
As networking is disabled, so we need to enable it to continue installing and updating the software.

* `vi /etc/sysconfig/network` to check/set the hostname
* `vi /etc/sysconfig/network-scripts/ifcfg-eth0` (the adapter name may be different, especially on servers). Here enable the network interface `ONBOOT=yes` and also set `IPV4_FAILURE_FATAL=yes` since we want to know if there are problems obtaining an IP address.
* Restart the network service: `service network restart`

Thanks to: http://www.serverlab.ca/tutorials/linux/administration-linux/configure-centos-6-network-settings/
## Update the operating system
Next, update the operating system: `yum update && yum upgrade` and answer `Y` when prompted to continue.
## Install various utilities
`yum install -y vim` a better `Vi`
Test by starting `vim` and/or by running `vim -version` (which is not recognised as valid but provides a shorter summary than `vim --version`)

`yum install -y pciutils usbutils` for `lspci` and `lsusb`

Test by running `lspci` and also `lsusb` to list the devices on the PCI and USB buses respectively.

# Install Java (and optionally the Java compiler)
Java is essential for various software, and we often use the compiler to create local utilities and/or compile software.

`yum install -y java`
Test by running `java -version`. The version should be `1.8.*` where `*` is actually the current release number. Note this doesn't test the java runtime's actually useful, that needs additional tests.

`yum install -y java-1.8.0-openjdk-devel.x86_64` will install Version 1.8 of the Open Java Development Toolkit. Note: `yum install java-devel` installed Version 1.7 !?

Test by running `javac -version`. The version should be `1.8.*` where `*` is actually the current release number. Note this doesn't test the compiler's actually useful, that needs additional tests.
## Create a new user with sudo access
Rather than use the `root` account let's create a new user account that we'll use in future. `sudo` is a Linux command to enable users to run commands with admin permissions.

For now let's add a user called `cleanroom`:
`adduser cleanroom`
`passwrd cleanroom` then provide a suitably strong password, twice.
`usermod -aG wheel cleanroom` Adds the new user to the `wheel` group. Separately we'll give this group `sudo` rights.
`visudo` to remove the comment to give the `wheel` group permission. There are two options in separate lines; one that requires the user to provide their password, the other doesn't.

Test the account.
`su - cleanroom` to switch to the new user.
`ls -la` run a simple command that should always work.
`sudo ls -la` now run the same command with `sudo` permission.  You should be asked for your password, the results of the command should be similar to `ls -la`. You'll see a warning if the user doesn't have `sudo` access: `cleanroom is not in the sudoers file. This incident will be reported.`

Thanks to:
https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-centos-quickstart
# Useful tips
Here are some helpful tips to work with `yum` and CentOS.
`yum search ...` can search for suitable packages e.g. `yum search java`.

See https://www.tecmint.com/things-to-do-after-minimal-rhel-centos-7-installation/ for various useful suggestions. So far, all the ones I've tried work on CentOS 6.9 too.
