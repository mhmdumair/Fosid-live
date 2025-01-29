import React, { useRef } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Entity } from "@/lib/utils";

interface Props {
  id: string;
  entity?: Entity;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TableActions({
  id,
  onView,
  onEdit,
  onDelete,
  entity,
}: Props) {
  const handleOnView = () => {
    // fetch

    onView && onView(id);
  };

  const handleOnEdit = () => {
    // fetch

    onEdit && onEdit(id);
  };

  const handleOnDelete = () => {
    // fetch

    onDelete && onDelete(id);
  };

  const fetchView = async ({
    id,
    entity,
  }: {
    id: string;
    entity?: Entity;
  }) => {
    // GET
    // await fetch(`/api/${getEntities(entity)}/${entity}?id=${id}`, methos);
  };

  const fetchEdit = async ({
    id,
    entity,
  }: {
    id: string;
    entity?: Entity;
  }) => {
    // PATCH
    // await fetch(`/api/${getEntities(entity)}/${entity}?id=${id}`, methos);
  };

  const fetchDelete = async ({
    id,
    entity,
  }: {
    id: string;
    entity?: Entity;
  }) => {
    // DELETE
    // await fetch(`/api/${getEntities(entity)}/${entity}?id=${id}`, methos);
  };

  return (
    <div className="table-actions flex w-full justify-end items-center gap-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={handleOnView}
            variant="ghost"
            size="sm"
            className="w-10 h-10 sm:w-8 sm:h-8 p-0 table-action-button bg-vq-peach text-vq-secondary aspect-square"
          >
            <FaEye />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
        <div></div>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={handleOnEdit}
            variant="ghost"
            size="sm"
            className="w-10 h-10 sm:w-8 sm:h-8 p-0 table-action-button bg-vq-gold text-vq-secondary aspect-square"
          >
            <FaEdit />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div></div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={handleOnDelete}
            variant="ghost"
            size="sm"
            className="w-10 h-10 sm:w-8 sm:h-8 p-0 table-action-button bg-vq-failure text-vq-white aspect-square"
          >
            <FaTrash size={12} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will delete the user from the
              database.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>content</p>
            {/* input with useRef */}
            {/* placeholder : first 5 letters of user id */}
            {/* user must type the first 5 leeters of the user id */}
            {/* cancle and delete */}
            {/* delete request to delete api endpoint */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
