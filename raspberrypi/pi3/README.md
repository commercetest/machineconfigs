Here are the configuration values used for Raspberry Pi 3 devices.

# Initial setup
We're using Raspbian as a base, the current shipping version from https://www.raspberrypi.org/downloads/raspbian/ Raspbian Stretch Lite (2017-09-07)

These are currently configured by hand ([Useful Documentation](https://github.com/keiraqz/RaspPiDemo/tree/master/kafka_config)):

`sudo raspi-config`

* Change password
* Memory Split 16MB
* ssh enabled
* hostname cleanroom-_nnn_ where _nnn_ is an integer from 0 upwards
* Filesystem expanded to the entire SD-card (16GB or 32GB)
* Update this program



### Kafka setup on Pis
* ZooKeeper/Producer Pi (e.g. commercetest-0)
  * Install and configure latest Zookeeper (https://gist.github.com/acsheller/6653072)
  * Create Topic 'test' (https://kafka.apache.org/quickstart)
  * Start Producing:
    ```bash
    # Simple Producer
    /usr/local/kafka/bin/kafka-console-producer.sh --broker-list cleanroom-1:9092 --topic test
    
    # Timestamp Producer (requires apt-get install moreutils)
    /usr/bin/yes | ts '[%Y-%m-%d %H:%M:%S]' | /usr/local/kafka/bin/kafka-console-producer.sh --broker-list cleanroom-1:9092 --topic test
    ```

* Kafka/Consumer Pi (e.g. commercetest-1)
  * Install and configure latest Kafka (https://github.com/keiraqz/RaspPiDemo/tree/master/kafka_config)
  * Start Consuming:
    ```bash
    /usr/local/kafka/bin/kafka-console-consumer.sh --zookeeper cleanroom-0:2181 --topic test
    ```
