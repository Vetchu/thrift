pushd Srv
thrift -r --gen js:node ../tutorial.thrift
popd
pushd Cli
thrift -r --gen py ../tutorial.thrift   
popd