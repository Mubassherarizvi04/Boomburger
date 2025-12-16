import { UserContext } from '@/context/userDataContext';
import { db } from '@/firebase/firebase.config';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// const orderData? = {
//   address: "374/3, Bhopal, Madhya Pradesh",
//   createdAt: "October 13, 2025 at 3:25:44 AM UTC+5:30",
//   customerEmail: "rajraja@gmail.com",
//   customerName: "Raj Parmar",
//   items: [
//     {
//       id: "9876543210",
//       image: "https://firebasestorage.googleapis.com/v0/b/boomburger-59f00.firebasestorage.app/o/food_images%2F1760031366794.jpg?alt=media&token=97d49c5a-21be-425f-ab70-41ab16691bb8",
//       name: "Aloo tikki burger",
//       price: 30,
//       quantity: 1,
//     },
//   ],
//   orderNumber: 575257,
//   payment: "Cash On Delivery",
//   status: "Pending",
//   subtotal: 30,
//   total: 50,
//   userId: "mBAkhBRHnGYWFk3A8hST4jLZznn1",
// };




const OrderDetails = () => {

  const [orderData, setOrderData] = useState<any>()
  const { userData } = useContext(UserContext)

  console.log(orderData)

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, "orders", typeof id === "string" ? id : Array.isArray(id) ? id[0] : "");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLoading(false)
          setOrderData(docSnap.data());
        } else {
          setLoading(false)
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching food:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (inputDate: any): string => {
    let date: Date;

    // 🟢 Firestore Timestamp handle kare
    if (inputDate?.toDate) {
      date = inputDate.toDate();
    }
    // 🟢 String handle kare (remove unwanted spaces/symbols)
    else if (typeof inputDate === "string") {
      // Non-breaking spaces aur special characters clean kar de
      const cleaned = inputDate.replace(/[^\x00-\x7F]/g, " ");
      date = new Date(cleaned);
    }
    // 🟢 Already JS Date object
    else {
      date = new Date(inputDate);
    }

    if (isNaN(date.getTime())) {
      console.warn("⚠️ Invalid date format:", inputDate);
      return "Invalid Date";
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const cancelOrder = async () => {
    if (orderData?.status === 'delivered') {
      alert("Ordre is Already Delivered !!")
    }
    try {
      setLoading(true);

      // Firestore doc reference
      const orderRef = doc(db, "orders", typeof id === "string" ? id : Array.isArray(id) ? id[0] : "");

      // Update the status field to "cancelled"
      await updateDoc(orderRef, {
        status: "cancelled",
        cancelledAt: new Date(), // optional: record cancel time
      });

      alert("Order has been cancelled successfully ✅");
      router.back();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order ❌");
    } finally {
      setLoading(false);
    }
  };
  const deliveredOrder = async () => {
    if (orderData?.status === 'delivered') {
      alert("Ordre is Already Delivered !!")
    }
    try {
      setLoading(true);

      // Firestore doc reference
      const orderRef = doc(db, "orders", typeof id === "string" ? id : Array.isArray(id) ? id[0] : "");

      // Update the status field to "cancelled"
      await updateDoc(orderRef, {
        status: "Delivered",
        deliveryAt: new Date(), // optional: record cancel time
      });

      alert("Order has been Delivered successfully ✅");
      router.back();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {
        loading ?
          <View style={{ width: '100%', height: '130%', backgroundColor: 'rgba(0,0,0,.4)', position: 'absolute', top: '50%', left: '50%', transform: "translate(-50%,-50%)", alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <ActivityIndicator size={35} color={'white'} />
          </View>
          :
          ''
      }
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Buyer Info Section */}
        <View style={styles.section}>
          <View style={styles.buyerInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {orderData?.customerName.charAt(0)}
              </Text>
            </View>
            <View style={styles.buyerTextContainer}>
              <Text style={styles.buyerName}>{orderData?.customerName}</Text>
              <Text style={styles.buyerSubtitle}>{orderData?.customerEmail}</Text>
            </View>
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total: ₹{orderData?.total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              Order Number: {orderData?.orderNumber}
            </Text>
          </View>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>

          {/* Order Created */}
          <View style={styles.statusItem}>
            <View style={styles.statusIconComplete}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Order Created</Text>
              <Text style={styles.statusTimestamp}>{formatDate(orderData?.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.statusItem}>
            {
              orderData?.status === 'Pending' || orderData?.status === 'Delivered'
                ?
                <View style={styles.statusIconComplete}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                :
                <View style={styles.statusIconPending}>
                  <View style={styles.pendingDot} />
                </View>
            }
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Preparing Order</Text>
              <Text style={styles.statusTimestamp}>Baking Items </Text>
            </View>
          </View>

          {/* if order is cancelled  */}
          {
            orderData?.status === 'cancelled' ?
              <View style={styles.statusItem}>
                <View style={styles.statusIconCancel}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>Order is Cancel</Text>
                  <Text style={styles.statusTimestamp}>{formatDate(orderData?.cancelledAt)}</Text>
                </View>
              </View>
              : ""
          }

          {/* Waiting for Payment */}
          <View style={styles.statusItem}>
            {
              orderData?.status === 'Delivered'
                ?
                <View style={styles.statusIconComplete}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                :
                <View style={styles.statusIconPending}>
                  <View style={styles.pendingDot} />
                </View>

            }

            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Delivery</Text>
              <Text style={styles.statusTimestamp}>{formatDate(orderData?.deliveryAt)}</Text>
            </View>
          </View>

          {/* Payment Status Box */}
          {
            orderData?.status === "Pending" ?
              <View style={styles.paymentStatusBox}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.paymentStatusText}>
                  Your Order is Baking
                </Text>
              </View>
              :
              ''
          }
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.notesContainer}>
            <Text style={styles.address}>
              {orderData?.address}
            </Text>

          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.notesContainer}>
            {orderData?.items.map((item: any) => (
              <Text key={item.id} style={styles.notesText}>
                {item.name} x {item.quantity}
              </Text>
            ))}
          </View>
        </View>

        {/* Cancel Button */}
        {
          orderData?.status === 'Pending' && userData?.email === 'developersucks@gmail.com' ? 
            <TouchableOpacity style={styles.deliveryBtn} onPress={()=>deliveredOrder()}>
              <Text style={{color:'white',fontWeight:600,fontSize:18}}>Delivered</Text>
            </TouchableOpacity>
            :
            ""
        }
        {
          orderData?.status === 'cancelled' ?
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Order Cancelled</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.cancelButton} onPress={() => cancelOrder()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        }
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  headerButton: {
    width: 60,
  },
  backArrow: {
    fontSize: 28,
    color: '#007AFF',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  doneButton: {
    fontSize: 17,
    color: '#007AFF',
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  buyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buyerTextContainer: {
    flex: 1,
  },
  buyerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  buyerSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  summaryRow: {
    paddingVertical: 6,
  },
  summaryText: {
    fontSize: 15,
    color: '#000000',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusIconComplete: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusIconCancel: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#c73434ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  statusIconPending: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pendingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8E8E93',
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  statusTimestamp: {
    fontSize: 13,
    color: '#8E8E93',
  },
  paymentStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  paymentStatusText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 12,
    lineHeight: 20,
  },
  notesContainer: {
    paddingVertical: 4,
  },
  notesText: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 22,
    fontWeight: 500
  },
  address: {
    fontSize: 16,
    color: '#555555ff',
    lineHeight: 22,
    fontWeight: 600
  },
  cancelButton: {
    marginHorizontal: 16,
    // marginVertical: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deliveryBtn: {
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor:'#34C759',
    borderRadius:5
  },
  cancelButtonText: {
    fontSize: 17,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default OrderDetails;
