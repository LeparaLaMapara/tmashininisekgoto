# Local setup for the Ubunye Engine examples walkthrough
# https://www.tmashininisekgoto.com/blog/ubunye-engine-examples
# Use from the root of the ubunye-examples repository, with its .venv active:
#   source examples-env.sh
# Sets Spark 4.2 + Delta 4.4.1 for local runs, downloads the Java libraries once,
# and defines peek "<SQL>" to show five rows of a result.

export EXAMPLES_ROOT="$PWD"
export DATA_DIR="$PWD/.local-data"
mkdir -p "$DATA_DIR/jars" "$DATA_DIR/tmp" "$DATA_DIR/corpus"
MAVEN=https://repo.maven.apache.org/maven2
[ -f "$DATA_DIR/jars/delta-spark.jar" ] || curl -fsSL "$MAVEN/io/delta/delta-spark_4.2_2.13/4.4.1/delta-spark_4.2_2.13-4.4.1.jar" \
  -o "$DATA_DIR/jars/delta-spark.jar"
[ -f "$DATA_DIR/jars/delta-storage.jar" ] || curl -fsSL "$MAVEN/io/delta/delta-storage/4.4.1/delta-storage-4.4.1.jar" \
  -o "$DATA_DIR/jars/delta-storage.jar"
[ -f "$DATA_DIR/jars/postgresql.jar" ] || curl -fsSL "$MAVEN/org/postgresql/postgresql/42.7.4/postgresql-42.7.4.jar" \
  -o "$DATA_DIR/jars/postgresql.jar"

export TZ=Africa/Johannesburg
export OMP_NUM_THREADS=2 OPENBLAS_NUM_THREADS=2 MKL_NUM_THREADS=2
export CUDA_VISIBLE_DEVICES='' SPARK_MASTER='local[2]'
export SPARK_LOCAL_IP=127.0.0.1 PYSPARK_PYTHON="$PWD/.venv/bin/python"
export TMPDIR="$DATA_DIR/tmp" SPARK_LOCAL_DIRS="$DATA_DIR/tmp"
export JAVA_TOOL_OPTIONS="-XX:ActiveProcessorCount=2 -Djava.io.tmpdir=$TMPDIR"
export SOURCE_CATALOG=spark_catalog UBUNYE_CATALOG=spark_catalog
export UBUNYE_SCHEMA=ubunye_examples UBUNYE_SINK=s3
export UBUNYE_DATA_ROOT="file://$DATA_DIR"
export UBUNYE_CORPUS="$PWD/examples/03_ingest_unstructured/data/corpus"
export TAXI_MODEL_STORE="$DATA_DIR/models"
export TAXI_MODELS_DIR="$PWD/examples/04_ml_taxi_fare/models"
export PYSPARK_SUBMIT_ARGS="--driver-memory 1g \
--jars $DATA_DIR/jars/delta-spark.jar,$DATA_DIR/jars/delta-storage.jar,$DATA_DIR/jars/postgresql.jar \
--conf spark.master=local[2] --conf spark.sql.shuffle.partitions=2 \
--conf spark.sql.session.timeZone=UTC \
--conf spark.databricks.delta.snapshotPartitions=2 \
--conf spark.ui.enabled=false --conf spark.ui.showConsoleProgress=false \
--conf spark.sql.extensions=io.delta.sql.DeltaSparkSessionExtension \
--conf spark.sql.catalog.spark_catalog=org.apache.spark.sql.delta.catalog.DeltaCatalog \
--conf spark.sql.catalogImplementation=hive \
--conf spark.sql.warehouse.dir=$DATA_DIR/warehouse \
--conf spark.hadoop.javax.jdo.option.ConnectionURL=jdbc:derby:;databaseName=$DATA_DIR/metastore_db;create=true \
pyspark-shell"


# peek "<SQL>": run SQL against the local tables and show five rows
peek() {
  python - "$1" <<'PY'
import sys
from pyspark.sql import SparkSession
spark = SparkSession.builder.enableHiveSupport().getOrCreate()
spark.sparkContext.setLogLevel("ERROR")
try:
    spark.sql(sys.argv[1]).show(5, truncate=False)
finally:
    spark.stop()
PY
}
