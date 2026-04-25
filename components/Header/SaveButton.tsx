import { TouchableOpacity } from "react-native"
import { Entypo } from "@expo/vector-icons"
import SpinLoading from "components/SpinLoading"
import { Colors } from "lib"

interface Props {
    onPress: () => void
    isSubmitting: boolean
}

const SaveButton = ({ onPress, isSubmitting }: Props) => (
    <TouchableOpacity
        className='ml-1.5'
        onPress={onPress}
        disabled={isSubmitting}
    >
        {isSubmitting ? (
            <SpinLoading size={24} color={Colors.principal.DEFAULT} />
        ) : (
            <Entypo
                color={Colors.principal.DEFAULT}
                name="save"
                size={24}
            />
        )}
    </TouchableOpacity>
)

export default SaveButton