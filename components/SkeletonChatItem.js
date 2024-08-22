import { StyleSheet, View } from 'react-native';
import { Colors, Padding } from '../lib';

const SkeletonChatItem = () => {
   return (
      <View style={styles.Container}>
         <View
            style={{
               backgroundColor: Colors.zinc[200],
               ...styles.Image,
            }}
         />
         <View style={styles.SemiContainer}>
            <View style={styles.SemiContainer.Top}>
               <View
                  style={styles.SemiContainer.Top.Name}
               />
               <View
                  style={styles.SemiContainer.Top.Time}
               />
            </View>
            <View
               style={styles.SemiContainer.Bottom}
            />
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   Container: {
      display: 'flex',
      flexDirection: 'row',
      padding: Padding[2],
      gap: Padding[2],
   },
   Image: {
      borderRadius: 25,
      width: 50,
      height: 50,
   },
   SemiContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      justifyContent: 'center',

      Top: {
         display: 'flex',
         flexDirection: 'row',
         alignItems: 'center',
         gap: 12,

         Name: {
            flex: 1,
            backgroundColor: Colors.zinc[200],
            height: 16,
            flex: 1,
         },
         Time: {
            backgroundColor: Colors.zinc[200],
            height: 16,
            width: 64,
         },
      },
      Bottom: {
         height: 16,
        backgroundColor: Colors.zinc[200],
      },
   },
});

export default SkeletonChatItem;
