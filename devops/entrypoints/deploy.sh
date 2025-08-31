#!/bin/sh

CONTEXT=devops/ansible

PLAYBOOK=$1
INVENTORY=$2
TARGET_HOST=$3

export SUDO_PASSWORD=$SUDO_PASSWORD

execute_playbook() {
    local playbook_path=$1
    local inventory_path=$2
    local target_host=$3
    echo "Executing playbook: $playbook_path on host: $inventory_path"
    if ansible-playbook "$playbook_path" -i "$inventory_path" --limit "$target_host" --extra-vars "ansible_become_pass=$SUDO_PASSWORD"; then
        echo "Playbook executed successfully: $playbook_path on host: $inventory_path"
    else
        echo "Error: Failed to execute playbook: $playbook_path on host: $inventory_path" >&2
        exit 1
    fi
}

execute_playbook $PLAYBOOK $INVENTORY $TARGET_HOST
