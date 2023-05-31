
echo reload cache

deno cache --reload=https://raw.githubusercontent.com/atmelino/d3no-data/livechart *

echo run

deno task start

echo press enter

read input

