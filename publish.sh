#!/usr/bin/env bash
##############################################################################
##
##  Publish JS,Android,iOS,Web
##
##############################################################################

CURRENT_DIR=$(cd $(dirname $0); pwd)
CURRENT_VERSION=$(cat $CURRENT_DIR/version)

echo "Current version is "$CURRENT_VERSION

cd $CURRENT_DIR && sh bundle.sh

# Modify

## JS
# cd $CURRENT_DIR/doric-js && npm version $CURRENT_VERSION --allow-same-version

## iOS
sed -i "" "s/\(version[ ]*= \)'[0-9 \.]*'/\1'$CURRENT_VERSION'/g" $CURRENT_DIR/DoricCore.podspec

sed -i "" "s/\(version[ ]*= \)'[0-9 \.]*'/\1'$CURRENT_VERSION'/g" $CURRENT_DIR/DoricDevkit.podspec

## CLI
# echo $CURRENT_VERSION > $CURRENT_DIR/doric-cli/assets/version

# cd $CURRENT_DIR/doric-cli && npm version $CURRENT_VERSION --allow-same-version

# git save
cd $CURRENT_DIR/

echo "Commit changes"
git add .
git commit -m "Release v${CURRENT_VERSION}"

git tag ${CURRENT_VERSION}

git push 

git push --tags
echo "Publish CLI"
# cd $CURRENT_DIR/doric-cli && npm publish 

echo "Publish iOS"
xcodebuild -version
cd $CURRENT_DIR && pod lib lint DoricCore.podspec --allow-warnings && pod lib lint DoricDevkit.podspec --allow-warnings
