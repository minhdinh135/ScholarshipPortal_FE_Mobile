import React from 'react'
import { View, Text, ImageBackground, TouchableOpacity, Animated } from 'react-native'
import {
  IconButton,
  LineDivider
} from "../../components/Card";
import { COLORS, FONTS, SIZES, icons, constants } from '../../constants';
import Description from '../../components/ScholarshipProgram/Description';
import Feedback from '../../components/ScholarshipProgram/Feedback';
import Discussion from '../../components/ScholarshipProgram/Discussion';

const course_details_tabs = constants.course_details_tabs.map((course_details_tab) => ({
  ...course_details_tab,
  ref: React.createRef()
}))

const TabIndicator = ({ measureLayout, scrollX }) => {

  const inputRange = course_details_tabs.map((_, i) => i * SIZES.width)

  const TabIndicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map(measure => measure.width)
  })

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map(measure => measure.x)
  })

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 0,
        height: 4,
        width: TabIndicatorWidth,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
        transform: [{
          translateX
        }]
      }}
    />
  )
}

const Tabs = ({ scrollX, onTabPress }) => {
  const [measureLayout, setMeasureLayout] = React.useState([]);
  const containerRef = React.useRef();

  React.useEffect(() => {
    let ml = [];

    course_details_tabs.forEach(course_details_tab => {
      course_details_tab?.ref?.current?.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          ml.push({
            x, y, width, height
          })

          if (ml.length === course_details_tabs.length) {
            setMeasureLayout(ml);
          }
        }
      )
    })
  }, [containerRef.current])

  return (
    <View
      ref={containerRef}
      style={{
        flex: 1,
        flexDirection: 'row'
      }}
    >

      {measureLayout.length > 0 && <TabIndicator
        measureLayout={measureLayout} scrollX={scrollX} />}

      {course_details_tabs.map((item, index) => {
        return (
          <TouchableOpacity
            key={`Tab-${index}`}
            ref={item.ref}
            style={{
              flex: 1,
              paddingHorizontal: 15,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => {
              onTabPress(index)
            }}
          >
            <Text
              style={{
                ...FONTS.h3,
                fontSize: SIZES.height > 800 ? 18 : 17
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const ScholarshipDetail = ({ navigation, route }) => {

  const { selectedScholarship } = route.params;
  const flatListRef = React.useRef();
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const onTabPress = React.useCallback(tabIndex => {
    flatListRef?.current?.scrollToOffset({
      offset: tabIndex * SIZES.width
    })
  })

  function renderHeaderComponent() {
    return (
      <>
        <View
          style={{
            flex: 1,
            marginTop: 10
          }}
        >
          <IconButton
            icon={icons.back}
            iconStyle={{
              width: 25,
              height: 25,
              tintColor: COLORS.black
            }}
            containerStyle={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              backgroundColor: COLORS.white
            }}
            onPress={() => navigation.goBack()}
          />
        </View>

        <View
          style={{
            flexDirection: 'row'
          }}
        >
          <IconButton
            icon={icons.favourite_outline}
            iconStyle={{
              tintColor: COLORS.white
            }}
            containerStyle={{
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </View>
      </>
    )
  }

  function renderHeader() {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.height > 800 ? 40 : 20,
          left: 0,
          right: 0,
          flexDirection: 'row',
          paddingHorizontal: SIZES.padding,
          zIndex: 1
        }}
      >
        {renderHeaderComponent()}
      </View>
    )
  }

  function renderScholarshipInfo() {
    return (
      <View style={{
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
      }}>
        <Text style={{ ...FONTS.h2 }}>{selectedScholarship?.name}</Text>
        <Text style={{ color: COLORS.gray60, marginTop: 5, ...FONTS.body3 }}>Ho Chi Minh City, Vietnam</Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              height: 50,
              backgroundColor: COLORS.primary,
              borderRadius: SIZES.radius,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
            onPress={() => navigation.navigate("MultiStep", { selectedScholarship: selectedScholarship })}
          >
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Apply Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              height: 50,
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: SIZES.radius,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => {/* Add view more action here */ }}
          >
            <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>View More</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderTop() {
    return (
      <View
        style={{
          height: SIZES.height > 800 ? 220 : 200,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.gray90
        }}
      >
        <ImageBackground
          src="https://daihoc.fpt.edu.vn/templates/fpt-university/images/header.jpg"
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
      </View>
    )
  }

  function renderContent() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            height: 50
          }}
        >
          <Tabs
            scrollX={scrollX}
            onTabPress={onTabPress}
          />
        </View>

        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.gray20
          }}
        />

        <Animated.FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          snapToAlignment='center'
          snapToInterval={SIZES.width}
          decelerationRate='fast'
          keyboardDismissMode='on-drag'
          showsHorizontalScrollIndicator={false}
          data={constants.course_details_tabs}
          keyExtractor={item => `CourseDetailTabs-${item.id}`}
          onScroll={
            Animated.event([
              {
                nativeEvent: { contentOffset: { x: scrollX } }
              }
            ],
              {
                useNativeDriver: false
              })
          }
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: SIZES.width
                }}
              >
                {index == 0 && <Description item={selectedScholarship} />}
                {index == 1 && <Feedback />}
                {index == 2 && <Discussion />}
              </View>
            )
          }}
        />
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white
      }}
    >
      {renderHeader()}
      {renderTop()}
      {renderScholarshipInfo()}
      {renderContent()}
    </View>
  )
}

export default ScholarshipDetail