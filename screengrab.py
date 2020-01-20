from PIL import ImageGrab

if __name__ == '__main__':
	# TODO: support non 1440p resolutions
	img = ImageGrab.grab((960, 360, 1600, 1000))
	img.save('out/screengrab.png')