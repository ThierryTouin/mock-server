#!/usr/bin/env bash

function display_help {
  echo "cmd"
  echo
  echo "Usage:" >&2
  echo "  cmd COMMAND [options] [arguments]"
  echo
  echo "front Commands:"
  echo "  cmd up          Start the application"
  echo "  cmd shell       Enter in container"
  echo "  cmd clean.......Clean the application"
  echo
  exit 1
}

if [ $# -gt 0 ]; then
  if [ "$1" == "shell" ]; then
    docker container exec -it mock-server /bin/sh
  elif [ "$1" == "clean" ]; then
    docker compose down --volumes --rmi all
  elif [ "$1" == "help" ] || [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    display_help
  else
    echo "Mock starting at \e[92mhttp://localhost:7000 \e[0m"
    docker compose up
  fi
else
  display_help
fi