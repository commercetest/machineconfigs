/usr/local/kafka/bin/kafka-run-class.sh kafka.tools.MirrorMaker\
        --consumer.config mirrormaker-consumer.config\
        --producer.config mirrormaker-producer.config\
        --whitelist='.*'
