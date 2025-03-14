"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


const ModalDialog = ({ open, onOpenChange, title, message, onConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                </DialogHeader>
                <p className="text-center">{message}</p>
                <Button onClick={onConfirm} className="mt-4 w-full">
                    확인
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ModalDialog;
