import DatePicker from "react-native-date-picker";
import { Alert } from "react-native";
import type { JSX } from "react";
import formatDateService from "functions/formatDateService";

type Props = {
    show: boolean;
    currentDate: string;
    onConfirm: (date: Date) => void;
    onCancel: () => void;
};

export function DatePickerModal({
    show,
    currentDate,
    onConfirm,
    onCancel,
}: Props): JSX.Element {
    return (
        <DatePicker
            modal
            mode="datetime"
            date={new Date(currentDate)}
            onConfirm={(date) => {
                if (date.getTime() === new Date(currentDate).getTime()) {
                    onCancel();
                    Alert.alert("Aviso", "No has cambiado la fecha");
                    return;
                }
                onConfirm(date);
            }}
            onCancel={onCancel}
            open={show}
            minimumDate={
                new Date(new Date().setMinutes(new Date().getMinutes() + 30))
            }
        />
    );
}