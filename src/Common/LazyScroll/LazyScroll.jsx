
import { useState, useEffect, useRef } from 'react'
import { renderToString } from 'react-dom/server'
import './LazyScroll.css'

function LazyScroll(props) {
    const items = props.items
    const slicedItems = items.slice(0,15)
    const firstRender = useRef(true)
    const forceUpdate = useRef(true)
    const finishedScrolling = useRef()

    const [data, setData] = useState({
        loadedItems: slicedItems,
        bottomStyle: {
            minHeight: 0 + "px",
            maxHeight: 0 + "px"
        },
        topStyle: {
            minHeight: 0 + "px",
            maxHeight: 0 + "px"
        },
        firstLoadedIndex: -1,
        lastLoadedIndex: -1
    })

    function scrollHandler(evt) {
        const paneHeight = evt.target.clientHeight
        const testItem = evt.target.children[1]
        const itemHeightTmp = window.getComputedStyle(testItem)
        const itemMargin = parseFloat(itemHeightTmp['marginTop'])
        const itemHeight = testItem.offsetHeight + itemMargin

        const scrollLocation = evt.target.scrollTop
        const totalScrollHeight = items.length * itemHeight;
        const scrollPercent = scrollLocation / totalScrollHeight
        const numberVisible = Math.ceil(paneHeight / itemHeight)

        const firstVisibleIndex = Math.floor((scrollPercent*100)*(items.length/100))
        const bufferCount = 2;
        const firstLoadedIndex = Math.max(0, firstVisibleIndex - bufferCount);
        const lastLoadedIndex = Math.min(firstVisibleIndex + numberVisible + bufferCount, items.length);

        const numNotLoadedBottom = firstLoadedIndex;
        const numNotLoadedTop = items.length - lastLoadedIndex;

        const heightNotLoadedBottom = numNotLoadedBottom * itemHeight
        const heightNotLoadedTop = numNotLoadedTop * itemHeight

        const sameData = (firstLoadedIndex == data.firstLoadedIndex && lastLoadedIndex == data.lastLoadedIndex)
        // if we're forcing an update, don't call the callback, but do update
        if(sameData && !forceUpdate.current) {
            return
        }
        forceUpdate.current = false
        setData({
            loadedItems: items.slice(firstLoadedIndex, lastLoadedIndex+1),
            bottomStyle: {
                minHeight: heightNotLoadedBottom + "px",
                maxHeight: heightNotLoadedBottom + "px",
                width: "50%"
            },
            topStyle: {
                minHeight: heightNotLoadedTop + "px",
                maxHeight: heightNotLoadedTop + "px",
                width: "50%"
            },
            firstLoadedIndex: firstLoadedIndex,
            lastLoadedIndex: lastLoadedIndex
        })
        clearTimeout(finishedScrolling.current)
        finishedScrolling.current = setTimeout(() => {
            if(!sameData) props.onLazyScroll(firstLoadedIndex, lastLoadedIndex)
        }, 200)
    }

    useEffect(() => {
        const fakeEvent = {
            target: document.querySelector('.lazy-scroll')
        }
        forceUpdate.current = true
        scrollHandler(fakeEvent)
        firstRender.current = false
    }, [items])

    useEffect(() => {
    })

    return (
        <div ref={props.forwardRef} className="lazy-scroll" style={{minHeight: props.minHeight, maxHeight: props.minHeight}} onScroll={scrollHandler}>
            <div id="lazy-scroll-bottom" style={data.bottomStyle} />
                {data.loadedItems}
            <div id="lazy-scroll-top" style={data.topStyle} />
        </div>
    )
}

export default LazyScroll
